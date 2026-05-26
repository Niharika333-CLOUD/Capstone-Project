const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getProductsByCategory,
  getProductsByBrand,
  getFeaturedProducts,
  getRecommendations,
  addReview,
  getAllBrands
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/brands', getAllBrands);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/brand/:brand', getProductsByBrand);
router.get('/:id', getProduct);

// Protected routes
router.get('/user/recommendations', protect, getRecommendations);
router.post('/:id/reviews', protect, addReview);

module.exports = router;

// Made with Bob
