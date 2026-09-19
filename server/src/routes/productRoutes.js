const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyAdminAuth } = require('../middleware/auth');

// Public endpoints
router.get('/', productController.getProducts);
router.get('/:identifier', productController.getProductDetail);

// Admin protected endpoints
router.get('/admin/all', verifyAdminAuth, productController.getAdminProducts);
router.post('/', verifyAdminAuth, productController.createProduct);
router.put('/:id', verifyAdminAuth, productController.updateProduct);
router.delete('/:id', verifyAdminAuth, productController.deleteProduct);
router.patch('/:id/toggle', verifyAdminAuth, productController.toggleProductFlag);

module.exports = router;
