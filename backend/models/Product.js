const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide author name'],
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand/publisher'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Review cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  specifications: {
    pages: Number,
    language: String,
    publisher: String,
    publicationDate: Date,
    dimensions: String,
    weight: String
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deliveryTime: {
    min: {
      type: Number,
      default: 3
    },
    max: {
      type: Number,
      default: 7
    }
  },
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  upSaleProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  crossSaleProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search optimization
productSchema.index({ title: 'text', description: 'text', author: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings.average = (sum / this.reviews.length).toFixed(1);
    this.ratings.count = this.reviews.length;
  }
  return this.save();
};

// Check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  return this.stock >= quantity;
};

// Reduce stock
productSchema.methods.reduceStock = function(quantity) {
  if (this.isInStock(quantity)) {
    this.stock -= quantity;
    this.purchaseCount += quantity;
    return this.save();
  }
  throw new Error('Insufficient stock');
};

// Increase view count
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);

// Made with Bob
