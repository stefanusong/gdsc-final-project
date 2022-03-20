const router = require('express').Router();
const isAuthenticated = require('../middleware/auth.middleware');
const { addCategory, getAllCategories, getCategoryById } = require('../controllers/category.controller');

router.post('/add-category', isAuthenticated, addCategory);
router.get('/', getAllCategories);
router.get('/:categoryId', getCategoryById);

module.exports = router;