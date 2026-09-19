const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAdminAuth } = require('../middleware/auth');

// Public endpoints
router.get('/', categoryController.getCategories);

// Admin endpoints
router.get('/admin/all', verifyAdminAuth, categoryController.getAllCategoriesAdmin);
router.post('/', verifyAdminAuth, categoryController.createCategory);
router.put('/:id', verifyAdminAuth, categoryController.updateCategory);
router.delete('/:id', verifyAdminAuth, categoryController.deleteCategory);

module.exports = router;
