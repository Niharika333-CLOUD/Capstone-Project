const express = require('express');
const router = express.Router();
const {
  getWriters,
  getWriter,
  getFollowing,
  followWriter,
  unfollowWriter
} = require('../controllers/writerController');
const { protect } = require('../middleware/auth');

// Protected routes (must be before /:id to avoid conflicts)
router.get('/following', protect, getFollowing);

// Public routes
router.get('/', getWriters);
router.get('/:id', getWriter);

// Protected routes
router.post('/:id/follow', protect, followWriter);
router.delete('/:id/follow', protect, unfollowWriter);

module.exports = router;

// Made with Bob