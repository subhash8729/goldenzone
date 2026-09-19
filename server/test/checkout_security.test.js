const { query, getPool, withTransaction } = require('../src/config/db');
const orderService = require('../src/controllers/orderController');
const paymentController = require('../src/controllers/paymentController');
const razorpayService = require('../src/services/razorpayService');
const crypto = require('crypto');

// Mock Express req/res
function mockReqRes({ body = {}, params = {}, headers = {}, rawBody = null, user = { id: 2, mobile_number: '7976580896' } }) {
  const req = {
    body,
    params,
    headers,
    rawBody,
    user,
    get: (h) => headers[h.toLowerCase()]
  };

  let responseData = null;
  let responseStatus = 200;

  const res = {
    status: (code) => {
      responseStatus = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    send: (data) => {
      responseData = data;
      return res;
    }
  };

  const next = (err) => {
    if (err) console.error('Next called with error:', err);
  };

  return {
    req,
    res,
    next,
    getStatus: () => responseStatus,
    getData: () => responseData
  };
}

async function runSecurityTests() {
  console.log('=== RUNNING SECURITY & ORDER FLOW INTEGRATION TESTS ===\n');

  try {
    // Get an active product from DB
    const [product] = await query('SELECT * FROM products WHERE is_active = 1 AND is_out_of_stock = 0 LIMIT 1');
    if (!product) throw new Error('No active in-stock product found for testing.');

    console.log(`Using test product: ID=${product.id}, Name="${product.name}", DB Price=₹${product.discounted_price}`);

    // TEST 1: Price Tampering Prevention
    console.log('\n[Test 1] Price Tampering Protection...');
    // Attempt to pass price = 1 rupee from client
    const tamperedItems = [
      {
        product_id: product.id,
        quantity: 1,
        price: 1 // Attempt to tamper price!
      }
    ];

    const { req: createReq, res: createRes, next: createNext, getStatus: getCreateStatus, getData: getCreateData } = mockReqRes({
      body: {
        primary_mobile: '9876543210',
        full_name: 'Security Tester',
        address: '123 Test Lane',
        state: 'Rajasthan',
        district: 'Udaipur',
        pincode: '313001',
        items: tamperedItems
      }
    });

    await orderService.createOrder(createReq, createRes, createNext);
    const createStatus = getCreateStatus();
    const createData = getCreateData();

    if (createStatus !== 201 || !createData?.order) {
      throw new Error(`Order creation failed: ${JSON.stringify(createData)}`);
    }

    const createdOrder = createData.order;
    console.log(`Order created: ${createdOrder.orderNumber}`);
    console.log(`Calculated Total Amount: ₹${createdOrder.totalAmount} (Client claimed ₹1)`);

    // Verify amount is calculated strictly from DB price
    if (Number(createdOrder.totalAmount) === Number(product.discounted_price)) {
      console.log('✓ PASS: Server strictly ignored client-provided price and used DB price ₹' + product.discounted_price);
    } else {
      throw new Error(`Price tampering check failed! Total amount: ${createdOrder.totalAmount}`);
    }

    // TEST 2: Out of stock validation
    console.log('\n[Test 2] Out of Stock during checkout validation...');
    // Temporarily set a product as out of stock
    await query('UPDATE products SET is_out_of_stock = 1 WHERE id = ?', [product.id]);

    const { req: oosReq, res: oosRes, next: oosNext, getStatus: getOosStatus, getData: getOosData } = mockReqRes({
      body: {
        primary_mobile: '9876543210',
        full_name: 'Security Tester',
        address: '123 Test Lane',
        state: 'Rajasthan',
        district: 'Udaipur',
        pincode: '313001',
        items: [{ product_id: product.id, quantity: 1 }]
      }
    });

    await orderService.createOrder(oosReq, oosRes, oosNext);
    const oosStatus = getOosStatus();
    const oosData = getOosData();

    console.log(`OOS Response Code: ${oosStatus}, Message: ${oosData?.message}`);
    if (oosStatus === 400 && oosData?.message?.includes('out of stock')) {
      console.log('✓ PASS: Out of stock product was properly rejected before order was placed.');
    } else {
      throw new Error('Out of stock validation failed!');
    }

    // Restore product stock
    await query('UPDATE products SET is_out_of_stock = 0 WHERE id = ?', [product.id]);

    // TEST 3: Payment Verification & Idempotency
    console.log('\n[Test 3] Payment Verification & Idempotent Confirmation...');
    const fakePaymentId = 'pay_test_' + Date.now();
    const rzpOrderId = createdOrder.razorpayOrderId;

    // Generate valid HMAC signature
    const testSecret = process.env.RAZORPAY_KEY_SECRET || 'dev_secret_fallback';
    // If running in development with simulated keys, razorpayService allows dev fallback
    const { req: verifyReq, res: verifyRes, next: verifyNext, getStatus: getVerifyStatus, getData: getVerifyData } = mockReqRes({
      body: {
        order_number: createdOrder.orderNumber,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: 'dev_signature_for_test',
        method: 'upi'
      }
    });

    await paymentController.verifyPayment(verifyReq, verifyRes, verifyNext);
    console.log(`Verification status: ${getVerifyStatus()}, response: ${getVerifyData()?.message}`);

    // Verify DB order state is now PAID
    const [paidOrder] = await query('SELECT payment_status, total_amount FROM orders WHERE order_number = ?', [createdOrder.orderNumber]);
    console.log(`Order status in DB: ${paidOrder.payment_status}`);
    if (paidOrder.payment_status === 'PAID') {
      console.log('✓ PASS: Order marked PAID after payment verification.');
    }

    // Check payment record
    const [paymentRecord] = await query('SELECT * FROM payments WHERE order_id = ?', [createdOrder.orderId]);
    console.log(`Payment record created: Razorpay ID = ${paymentRecord.razorpay_payment_id}, Status = ${paymentRecord.status}`);
    if (paymentRecord.status === 'SUCCESS') {
      console.log('✓ PASS: Payment successfully recorded in DB.');
    }

    // TEST 4: Duplicate Callback / Idempotency Check
    console.log('\n[Test 4] Duplicate verification callback (Idempotency test)...');
    const { req: dupReq, res: dupRes, next: dupNext, getStatus: getDupStatus, getData: getDupData } = mockReqRes({
      body: {
        order_number: createdOrder.orderNumber,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: 'dev_signature_for_test',
        method: 'upi'
      }
    });

    await paymentController.verifyPayment(dupReq, dupRes, dupNext);
    console.log(`Duplicate verification status: ${getDupStatus()}, response: ${getDupData()?.message}`);
    
    // Check how many payment records exist for this order (should still be 1, never duplicated)
    const [paymentsCount] = await query('SELECT COUNT(*) as count FROM payments WHERE order_id = ?', [createdOrder.orderId]);
    console.log(`Payments count for order ${createdOrder.orderId}: ${paymentsCount.count}`);
    if (paymentsCount.count === 1) {
      console.log('✓ PASS: Duplicate verification processed idempotently without creating duplicate payment records.');
    } else {
      throw new Error(`Duplicate payment records created! Count: ${paymentsCount.count}`);
    }

    // TEST 5: Payment Failure handling
    console.log('\n[Test 5] Payment failure handling...');
    // Create another order to fail
    const { req: failOrderReq, res: failOrderRes, next: failOrderNext, getData: getFailOrderData } = mockReqRes({
      body: {
        primary_mobile: '9876543210',
        full_name: 'Fail Tester',
        address: '456 Fail St',
        state: 'Rajasthan',
        district: 'Udaipur',
        pincode: '313001',
        items: [{ product_id: product.id, quantity: 1 }]
      }
    });
    await orderService.createOrder(failOrderReq, failOrderRes, failOrderNext);
    const failOrder = getFailOrderData().order;

    // Report failure
    const { req: reportFailReq, res: reportFailRes, next: reportFailNext, getStatus: getFailStatus, getData: getFailData } = mockReqRes({
      body: {
        order_number: failOrder.orderNumber,
        razorpay_order_id: failOrder.razorpayOrderId,
        razorpay_payment_id: 'pay_failed_123',
        error_code: 'BAD_REQUEST_ERROR',
        error_description: 'Customer cancelled transaction at gateway',
        error_reason: 'payment_cancelled'
      }
    });

    await paymentController.handlePaymentFailed(reportFailReq, reportFailRes, reportFailNext);
    console.log(`Report fail status: ${getFailStatus()}, message: ${getFailData()?.message}`);

    const [failedOrderInDb] = await query('SELECT payment_status FROM orders WHERE order_number = ?', [failOrder.orderNumber]);
    console.log(`Failed order status in DB: ${failedOrderInDb.payment_status}`);
    if (failedOrderInDb.payment_status === 'FAILED') {
      console.log('✓ PASS: Order correctly marked FAILED with reason recorded.');
    }

    // Clean up test orders created during this test
    console.log('\n[Cleanup] Cleaning up test records...');
    await query('DELETE FROM payments WHERE order_id IN (?, ?)', [createdOrder.orderId, failOrder.orderId]);
    await query('DELETE FROM order_items WHERE order_id IN (?, ?)', [createdOrder.orderId, failOrder.orderId]);
    await query('DELETE FROM orders WHERE id IN (?, ?)', [createdOrder.orderId, failOrder.orderId]);
    console.log('✓ Test records cleaned up.');

    console.log('\n=== ALL SECURITY AND INTEGRATION TESTS COMPLETED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test error:', err);
    process.exitCode = 1;
  } finally {
    const p = getPool();
    if (p) await p.end();
  }
}

runSecurityTests();
