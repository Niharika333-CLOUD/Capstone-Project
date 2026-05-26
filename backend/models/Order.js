const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    title: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: String
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'wallet', 'cod', 'upi'],
      required: true
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    giftPointsUsed: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  coupon: {
    code: String,
    discount: Number
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  shipping: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: {
      min: Date,
      max: Date
    },
    actualDelivery: Date,
    shippingRate: Number
  },
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: Date,
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin']
    }
  },
  return: {
    isReturned: {
      type: Boolean,
      default: false
    },
    returnedAt: Date,
    reason: String,
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'completed']
    }
  },
  giftPointsEarned: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate total
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.pricing.subtotal = subtotal;
  this.pricing.total = subtotal + this.pricing.tax + this.pricing.shippingCost - this.pricing.discount - this.pricing.giftPointsUsed;
  return this.pricing.total;
};

// Update order status
orderSchema.methods.updateStatus = function(status, note = '') {
  this.orderStatus = status;
  this.statusHistory.push({
    status,
    note,
    timestamp: new Date()
  });
  return this.save();
};

// Check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const hoursSinceOrder = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  return hoursSinceOrder <= 48 && !['shipped', 'delivered', 'cancelled'].includes(this.orderStatus);
};

// Cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy = 'customer') {
  if (this.canBeCancelled()) {
    this.cancellation.isCancelled = true;
    this.cancellation.cancelledAt = new Date();
    this.cancellation.reason = reason;
    this.cancellation.cancelledBy = cancelledBy;
    this.orderStatus = 'cancelled';
    this.statusHistory.push({
      status: 'cancelled',
      note: reason,
      timestamp: new Date()
    });
    return this.save();
  }
  throw new Error('Order cannot be cancelled after 48 hours or if already shipped/delivered');
};

module.exports = mongoose.model('Order', orderSchema);

// Made with Bob
