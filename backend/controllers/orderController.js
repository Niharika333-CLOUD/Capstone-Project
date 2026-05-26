const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      useGiftPoints = 0,
      couponCode
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify stock availability for all items
    for (const item of cart.items) {
      if (!item.product.isInStock(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.title}`
        });
      }
    }

    // Calculate pricing
    const subtotal = cart.totalPrice;
    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping over 500
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      // Coupon logic here
      discount = subtotal * 0.05; // 5% discount example
    }

    // Validate and apply gift points
    const user = await User.findById(req.user.id);
    const maxGiftPointsUsable = Math.min(useGiftPoints, user.giftPoints, subtotal * 0.2); // Max 20% of subtotal

    const total = subtotal + tax + shippingCost - discount - maxGiftPointsUsable;

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      title: item.product.title,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }));

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: 'pending'
      },
      pricing: {
        subtotal,
        tax,
        shippingCost,
        discount,
        giftPointsUsed: maxGiftPointsUsable,
        total
      },
      coupon: couponCode ? { code: couponCode, discount } : undefined,
      shipping: {
        estimatedDelivery: {
          min: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          max: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Deduct gift points if used
    if (maxGiftPointsUsable > 0) {
      await user.redeemGiftPoints(maxGiftPointsUsable);
    }

    // Reduce stock for all products
    for (const item of cart.items) {
      await item.product.reduceStock(item.quantity);
    }

    // Clear cart
    await cart.clearCart();

    // Add order to user's order history
    user.orderHistory.push(order._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title images author');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { transactionId, status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentInfo.transactionId = transactionId;
    order.paymentInfo.status = status;

    if (status === 'completed') {
      order.paymentInfo.paidAt = Date.now();
      await order.updateStatus('confirmed', 'Payment completed');

      // Award gift points (1% of order total)
      const giftPointsEarned = Math.floor(order.pricing.total * 0.01);
      order.giftPointsEarned = giftPointsEarned;

      const user = await User.findById(order.user);
      await user.addGiftPoints(giftPointsEarned);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    await order.cancelOrder(reason, 'customer');

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Refund gift points if used
    if (order.pricing.giftPointsUsed > 0) {
      const user = await User.findById(order.user);
      await user.addGiftPoints(order.pricing.giftPointsUsed);
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    if (error.message.includes('cannot be cancelled')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Request order return
// @route   PUT /api/orders/:id/return
// @access  Private
exports.requestReturn = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only return delivered orders'
      });
    }

    order.return = {
      isReturned: true,
      returnedAt: Date.now(),
      reason,
      status: 'requested'
    };

    await order.updateStatus('returned', `Return requested: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Return request submitted',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder (Buy Again)
// @route   POST /api/orders/:id/reorder
// @access  Private
exports.reorder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
    }

    // Add all items from order to cart
    for (const item of order.items) {
      if (item.product && item.product.isActive && item.product.isInStock(item.quantity)) {
        await cart.addItem(item.product._id, item.quantity, item.product.price);
      }
    }

    await cart.populate({
      path: 'items.product',
      select: 'title price images stock isActive'
    });

    res.status(200).json({
      success: true,
      message: 'Items added to cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob
