const db = require('../config/db');
const razorpayService = require('../services/razorpayService');
const { logAdminAction } = require('./authController');

// Format full readable date e.g. "18 Sep 2026, 10:45 PM"
function formatReadableDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * 1. Customer: Verify payment signature after checkout modal
 * Verifies Razorpay HMAC SHA256 signature and confirms order idempotently
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      order_id,
      order_number,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment verification fields.'
      });
    }

    // Cryptographic signature check
    const isValid = razorpayService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      // Record failure on payment record for tracking
      await db.query(
        `UPDATE payments 
         SET payment_status = 'FAILED', 
             razorpay_payment_id = ?, 
             error_reason = 'Signature verification failed' 
         WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_order_id]
      );

      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Transaction was not authenticated.'
      });
    }

    // Fetch additional payment metadata (payment method: upi/card/netbanking etc.)
    let paymentMethod = 'RAZORPAY';
    try {
      const rzpPayment = await razorpayService.fetchPaymentDetails(razorpay_payment_id);
      if (rzpPayment && rzpPayment.method) {
        paymentMethod = rzpPayment.method.toUpperCase();
      }
    } catch (e) {
      console.log('Notice: Could not fetch payment method detail from Razorpay:', e.message);
    }

    // Update Order and Payment within an atomic MySQL transaction
    const verifyResult = await db.withTransaction(async (conn) => {
      // Find order by id or razorpay_order_id
      let findSql = `SELECT * FROM orders WHERE razorpay_order_id = ? FOR UPDATE`;
      let findParams = [razorpay_order_id];

      if (order_id) {
        findSql = `SELECT * FROM orders WHERE id = ? FOR UPDATE`;
        findParams = [order_id];
      }

      const [orderRows] = await conn.execute(findSql, findParams);

      if (orderRows.length === 0) {
        throw new Error('Order corresponding to this Razorpay payment was not found.');
      }

      const order = orderRows[0];

      // IDEMPOTENCY CHECK: If already confirmed & paid, return immediately
      if (order.payment_status === 'PAID') {
        return {
          alreadyVerified: true,
          orderNumber: order.order_number,
          orderId: order.id
        };
      }

      // Mark order as PAID
      await conn.execute(
        `UPDATE orders
         SET payment_status = 'PAID',
             razorpay_order_id = ?
         WHERE id = ?`,
        [razorpay_order_id, order.id]
      );

      // Update payment record to PAID with transaction details
      await conn.execute(
        `UPDATE payments
         SET payment_status = 'PAID',
             razorpay_payment_id = ?,
             transaction_id = ?,
             razorpay_signature = ?,
             payment_method = ?,
             error_reason = NULL
         WHERE order_id = ? OR razorpay_order_id = ?`,
        [
          razorpay_payment_id,
          razorpay_payment_id,
          razorpay_signature,
          paymentMethod,
          order.id,
          razorpay_order_id
        ]
      );

      return {
        alreadyVerified: false,
        orderNumber: order.order_number,
        orderId: order.id
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully and order placed!',
      orderNumber: verifyResult.orderNumber,
      orderId: verifyResult.orderId,
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Record payment failure or cancellation from client
 */
exports.handlePaymentFailed = async (req, res, next) => {
  try {
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      error_description,
      error_code
    } = req.body;

    const reason = error_description || error_code || 'Payment cancelled or dismissed by customer';

    await db.query(
      `UPDATE payments
       SET payment_status = 'FAILED',
           razorpay_payment_id = COALESCE(?, razorpay_payment_id),
           error_reason = ?
       WHERE (order_id = ? OR razorpay_order_id = ?) AND payment_status != 'PAID'`,
      [razorpay_payment_id || null, reason, order_id || 0, razorpay_order_id || '']
    );

    return res.status(200).json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Razorpay Official Webhook Handler
 * Verified via HMAC SHA-256 using RAZORPAY_WEBHOOK_SECRET
 * Strictly processes required payment and refund events idempotently:
 * - payment.captured
 * - payment.failed
 * - refund.created
 * - refund.processed
 * - refund.failed
 */
exports.handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody;

    // Cryptographically verify webhook signature
    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.warn('⚠️ [Razorpay Webhook]: Signature mismatch or unauthenticated webhook request.');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;
    const eventId = req.headers['x-razorpay-event-id'] || req.body.event_id || req.body.id;

    console.log(`🔔 [Razorpay Webhook Event]: ${event} (Event ID: ${eventId || 'N/A'})`);

    // Only allow configured relevant events
    const allowedEvents = [
      'payment.captured',
      'payment.failed',
      'refund.created',
      'refund.processed',
      'refund.failed'
    ];

    if (!allowedEvents.includes(event)) {
      console.log(`ℹ️ [Razorpay Webhook]: Ignoring unrelated event "${event}"`);
      return res.status(200).json({ status: 'ignored_unrelated_event' });
    }

    // IDEMPOTENCY CHECK: Ensure this event has not already been processed
    if (eventId) {
      const existingEvents = await db.query(
        'SELECT event_id FROM webhook_events WHERE event_id = ? LIMIT 1',
        [eventId]
      );

      if (existingEvents.length > 0) {
        console.log(`ℹ️ [Razorpay Webhook]: Event ${eventId} was already processed idempotently.`);
        return res.status(200).json({ status: 'ok', already_processed: true });
      }
    }

    // Process event within database transaction
    await db.withTransaction(async (conn) => {
      // Record event ID to guarantee idempotency
      if (eventId) {
        await conn.execute(
          'INSERT INTO webhook_events (event_id, event_type, payload) VALUES (?, ?, ?)',
          [eventId, event, JSON.stringify({ event, eventId, timestamp: Date.now() })]
        );
      }

      if (event === 'payment.captured') {
        const paymentEntity = payload.payment?.entity;
        const rzpOrderId = paymentEntity?.order_id;
        const rzpPaymentId = paymentEntity?.id;
        const method = paymentEntity?.method ? paymentEntity.method.toUpperCase() : 'RAZORPAY';

        if (rzpOrderId) {
          const [orders] = await conn.execute(
            `SELECT id, order_number, payment_status, payment_mode, total_amount, advance_amount, remaining_cod_amount 
             FROM orders WHERE razorpay_order_id = ? FOR UPDATE`,
            [rzpOrderId]
          );

          if (orders.length > 0) {
            const order = orders[0];

            if (order.payment_status !== 'PAID') {
              await conn.execute(
                `UPDATE orders SET payment_status = 'PAID' WHERE id = ?`,
                [order.id]
              );

              await conn.execute(
                `UPDATE payments
                 SET payment_status = 'PAID',
                     razorpay_payment_id = COALESCE(?, razorpay_payment_id),
                     transaction_id = COALESCE(?, transaction_id),
                     payment_method = ?,
                     error_reason = NULL
                 WHERE order_id = ? OR razorpay_order_id = ?`,
                [rzpPaymentId, rzpPaymentId, method, order.id, rzpOrderId]
              );

              console.log(`✅ [Razorpay Webhook]: Order #${order.order_number} confirmed & marked as PAID via payment.captured`);
            }
          }
        }
      } else if (event === 'payment.failed') {
        const paymentEntity = payload.payment?.entity;
        const rzpOrderId = paymentEntity?.order_id;
        const rzpPaymentId = paymentEntity?.id;
        const errorDesc = paymentEntity?.error_description || paymentEntity?.error_reason || 'Payment failed';

        if (rzpOrderId) {
          await conn.execute(
            `UPDATE payments
             SET payment_status = 'FAILED',
                 razorpay_payment_id = COALESCE(?, razorpay_payment_id),
                 error_reason = ?
             WHERE razorpay_order_id = ? AND payment_status != 'PAID'`,
            [rzpPaymentId, errorDesc, rzpOrderId]
          );
        }
      } else if (event === 'refund.created' || event === 'refund.processed') {
        const refundEntity = payload.refund?.entity;
        const paymentEntity = payload.payment?.entity;
        const rzpPaymentId = refundEntity?.payment_id || paymentEntity?.id;
        const refundId = refundEntity?.id;
        const refundAmount = refundEntity?.amount ? refundEntity.amount / 100 : 0.0;
        const refundStatus = refundEntity?.status || (event === 'refund.processed' ? 'processed' : 'created');

        if (rzpPaymentId) {
          await conn.execute(
            `UPDATE payments
             SET refund_id = ?,
                 refund_amount = ?,
                 refund_status = ?,
                 refunded_at = NOW(),
                 payment_status = CASE WHEN ? = 'processed' THEN 'REFUNDED' ELSE payment_status END
             WHERE razorpay_payment_id = ?`,
            [refundId, refundAmount, refundStatus, refundStatus, rzpPaymentId]
          );

          console.log(`↩️ [Razorpay Webhook]: Refund ${refundId} recorded for payment ${rzpPaymentId} (${refundStatus})`);
        }
      } else if (event === 'refund.failed') {
        const refundEntity = payload.refund?.entity;
        const rzpPaymentId = refundEntity?.payment_id;
        const refundId = refundEntity?.id;
        const errReason = refundEntity?.error_description || 'Refund processing failed';

        if (rzpPaymentId) {
          await conn.execute(
            `UPDATE payments
             SET refund_id = ?,
                 refund_status = 'failed',
                 error_reason = ?
             WHERE razorpay_payment_id = ?`,
            [refundId, errReason, rzpPaymentId]
          );
        }
      }
    });

    // Always respond with 200 HTTP status as required by Razorpay webhook specifications
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('❌ [Razorpay Webhook Error]:', error);
    return res.status(200).json({ status: 'error_logged' });
  }
};

/**
 * 4. Admin: Get all real payment records
 * Displays:
 * - order number
 * - customer name
 * - mobile
 * - Razorpay order ID
 * - Razorpay payment ID
 * - amount
 * - payment mode
 * - payment status
 * - payment method
 * - date/time
 * - COD advance / full payment
 * - remaining COD amount where applicable
 * - refund information if available
 */
exports.getPayments = async (req, res, next) => {
  try {
    const { search, payment_status, page = 1, limit = 50 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const countParams = [];

    let whereSql = '';
    const conditions = [];

    if (payment_status && payment_status !== 'all') {
      conditions.push('p.payment_status = ?');
      params.push(payment_status);
      countParams.push(payment_status);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        '(o.order_number LIKE ? OR o.full_name LIKE ? OR o.primary_mobile LIKE ? OR p.transaction_id LIKE ? OR p.razorpay_order_id LIKE ? OR p.razorpay_payment_id LIKE ?)'
      );
      params.push(term, term, term, term, term, term);
      countParams.push(term, term, term, term, term, term);
    }

    if (conditions.length > 0) {
      whereSql = `WHERE ${conditions.join(' AND ')}`;
    }

    const countRows = await db.query(
      `SELECT COUNT(*) as total FROM payments p LEFT JOIN orders o ON p.order_id = o.id ${whereSql}`,
      countParams
    );
    const totalItems = countRows[0].total;

    const payments = await db.query(
      `SELECT p.*,
              o.order_number,
              o.full_name,
              o.primary_mobile,
              o.is_delivered,
              o.is_shipped,
              o.payment_mode as order_payment_mode,
              o.advance_amount as order_advance_amount,
              o.remaining_cod_amount as order_remaining_cod_amount,
              o.created_at as order_created_at
       FROM payments p
       LEFT JOIN orders o ON p.order_id = o.id
       ${whereSql}
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    const formatted = payments.map((pm) => {
      const mode = pm.payment_mode || pm.order_payment_mode || 'ONLINE';
      const type = pm.payment_type || (mode === 'COD' ? 'COD_ADVANCE' : 'FULL');
      const remCod = parseFloat(pm.remaining_cod_amount ?? pm.order_remaining_cod_amount ?? 0);
      const advAmt = parseFloat(pm.order_advance_amount || 0);

      return {
        ...pm,
        amount: parseFloat(pm.amount),
        payment_mode: mode,
        payment_type: type,
        remaining_cod_amount: remCod,
        advance_amount: advAmt,
        refund_amount: parseFloat(pm.refund_amount || 0),
        formatted_date: formatReadableDate(pm.created_at),
        order_date: formatReadableDate(pm.order_created_at),
        formatted_refund_date: pm.refunded_at ? formatReadableDate(pm.refunded_at) : null
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalItems,
        totalPages: Math.ceil(totalItems / parseInt(limit, 10))
      }
    });
  } catch (error) {
    next(error);
  }
};
