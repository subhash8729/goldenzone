const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyAdminAuth } = require('../middleware/auth');

// Public endpoints
router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', reviewController.submitReview);

// Admin endpoints
router.get('/admin/all', verifyAdminAuth, reviewController.getAdminReviews);
router.patch('/admin/:id/approval', verifyAdminAuth, reviewController.toggleReviewApproval);
router.delete('/admin/:id', verifyAdminAuth, reviewController.deleteReview);

module.exports = router;
