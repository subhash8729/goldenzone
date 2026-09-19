const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyCustomerAuth, verifyAdminAuth, optionalCustomerAuth } = require('../middleware/auth');
const { orderLimiter } = require('../middleware/rateLimiter');

// Customer / Storefront payment verification & failure handling
router.post('/verify', optionalCustomerAuth, orderLimiter, paymentController.verifyPayment);
router.post('/failed', optionalCustomerAuth, paymentController.handlePaymentFailed);

// Official Razorpay Webhook endpoint
router.post('/webhook', paymentController.handleWebhook);

// Admin payment records & transaction logs
router.get('/admin/all', verifyAdminAuth, paymentController.getPayments);

module.exports = router;
