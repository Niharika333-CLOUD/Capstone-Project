const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { 'ratings.average': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { purchaseCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('relatedProducts', 'title price images ratings')
      .populate('upSaleProducts', 'title price images ratings')
      .populate('crossSaleProducts', 'title price images ratings')
      .populate({
        path: 'reviews.user',
        select: 'name'
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.incrementViewCount();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, sort } = req.query;

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else sortOption = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true
    })
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments({
      category: req.params.categoryId,
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by brand
// @route   GET /api/products/brand/:brand
// @access  Public
exports.getProductsByBrand = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      brand: req.params.brand,
      isActive: true
    })
      .populate('category', 'name slug')
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments({
      brand: req.params.brand,
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true
    })
      .populate('category', 'name slug')
      .limit(10);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended products based on order history
// @route   GET /api/products/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const user = await req.user.populate({
      path: 'orderHistory',
      populate: {
        path: 'items.product',
        select: 'category brand'
      }
    });

    // Extract categories and brands from order history
    const categories = new Set();
    const brands = new Set();

    user.orderHistory.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          categories.add(item.product.category.toString());
          brands.add(item.product.brand);
        }
      });
    });

    // Find products matching user's preferences
    const recommendations = await Product.find({
      $or: [
        { category: { $in: Array.from(categories) } },
        { brand: { $in: Array.from(brands) } }
      ],
      isActive: true
    })
      .populate('category', 'name slug')
      .sort({ 'ratings.average': -1, purchaseCount: -1 })
      .limit(12);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Add review
    product.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    await product.calculateAverageRating();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all brands
// @route   GET /api/products/brands/all
// @access  Public
exports.getAllBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands.sort()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob
