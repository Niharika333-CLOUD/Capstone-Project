const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  updatePaymentStatus,
  cancelOrder,
  requestReturn,
  reorder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All order routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/payment', updatePaymentStatus);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/return', requestReturn);
router.post('/:id/reorder', reorder);

module.exports = router;

// Made with Bob
