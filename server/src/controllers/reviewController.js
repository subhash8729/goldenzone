const db = require('../config/db');
const { logAdminAction } = require('./authController');

// 1. Get reviews for a product
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await db.query(
      `SELECT r.*, p.name as product_name
       FROM reviews r
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.product_id = ? AND r.is_approved = 1
       ORDER BY r.id DESC`,
      [productId]
    );

    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// 2. Submit a review (Customer/Visitor)
exports.submitReview = async (req, res, next) => {
  try {
    const { product_id, customer_name, rating, review_text, image_url } = req.body;

    if (!product_id || !customer_name || !rating || !review_text) {
      return res.status(400).json({ success: false, message: 'All review fields are required' });
    }

    const numRating = Math.max(1, Math.min(5, parseInt(rating, 10)));

    const result = await db.query(
      `INSERT INTO reviews (product_id, customer_name, rating, review_text, image_url, is_approved)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [product_id, customer_name.trim(), numRating, review_text.trim(), image_url || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      reviewId: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

// 3. Admin: Get all reviews
exports.getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await db.query(
      `SELECT r.*, p.name as product_name, p.sku as product_sku
       FROM reviews r
       LEFT JOIN products p ON r.product_id = p.id
       ORDER BY r.id DESC`
    );

    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// 4. Admin: Toggle approve / hide review
exports.toggleReviewApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    await db.query('UPDATE reviews SET is_approved = ? WHERE id = ?', [is_approved ? 1 : 0, id]);
    await logAdminAction(req.admin.id, 'REVIEW_VISIBILITY_TOGGLED', 'REVIEW', id, { is_approved });

    return res.status(200).json({
      success: true,
      message: `Review ${is_approved ? 'approved' : 'hidden'} successfully`
    });
  } catch (error) {
    next(error);
  }
};

// 5. Admin: Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    await logAdminAction(req.admin.id, 'REVIEW_DELETED', 'REVIEW', id);

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
