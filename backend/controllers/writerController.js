const Writer = require('../models/Writer');
const User = require('../models/User');

// @desc    Get writers that the user is following
// @route   GET /api/writers/following
// @access  Private
exports.getFollowing = async (req, res, next) => {
  try {
    // Find all writers where the current user is in the followers array
    const followedWriters = await Writer.find({
      followers: req.user.id,
      isActive: true
    })
      .select('name bio image nationality genres followerCount books recentWorks')
      .populate('books', 'title')
      .sort({ name: 1 });

    // Add bookCount and isFollowing to each writer
    const writersWithDetails = followedWriters.map(writer => ({
      _id: writer._id,
      name: writer.name,
      bio: writer.bio,
      photo: writer.image,
      nationality: writer.nationality,
      genres: writer.genres,
      followerCount: writer.followerCount,
      bookCount: writer.books ? writer.books.length : 0,
      recentWorks: writer.recentWorks,
      isFollowing: true
    }));

    res.status(200).json({
      success: true,
      count: writersWithDetails.length,
      data: writersWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all writers
// @route   GET /api/writers
// @access  Public
exports.getWriters = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, genre } = req.query;
    const userId = req.user ? req.user.id : null;

    // Build query
    let query = { isActive: true };

    // Search filter
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Genre filter
    if (genre) {
      query.genres = genre;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const writers = await Writer.find(query)
      .select('name bio image nationality genres followerCount books recentWorks followers')
      .populate('books', 'title')
      .sort({ followerCount: -1, name: 1 })
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await Writer.countDocuments(query);

    // Add bookCount and isFollowing to each writer
    const writersWithDetails = writers.map(writer => ({
      _id: writer._id,
      name: writer.name,
      bio: writer.bio,
      photo: writer.image,
      nationality: writer.nationality,
      genres: writer.genres,
      followerCount: writer.followerCount,
      bookCount: writer.books ? writer.books.length : 0,
      recentWorks: writer.recentWorks,
      isFollowing: userId ? writer.followers.some(f => f.toString() === userId) : false
    }));

    res.status(200).json({
      success: true,
      count: writersWithDetails.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: writersWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single writer
// @route   GET /api/writers/:id
// @access  Public
exports.getWriter = async (req, res, next) => {
  try {
    const writer = await Writer.findById(req.params.id)
      .populate('books', 'title price images ratings');

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'Writer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: writer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a writer
// @route   POST /api/writers/:id/follow
// @access  Private
exports.followWriter = async (req, res, next) => {
  try {
    const writer = await Writer.findById(req.params.id);

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'Writer not found'
      });
    }

    // Check if already following
    const isFollowing = writer.followers.includes(req.user.id);

    if (isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this writer'
      });
    }

    // Add user to followers
    writer.followers.push(req.user.id);
    await writer.updateFollowerCount();

    res.status(200).json({
      success: true,
      message: 'Successfully followed writer',
      data: writer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a writer
// @route   DELETE /api/writers/:id/follow
// @access  Private
exports.unfollowWriter = async (req, res, next) => {
  try {
    const writer = await Writer.findById(req.params.id);

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'Writer not found'
      });
    }

    // Check if following
    const followerIndex = writer.followers.indexOf(req.user.id);

    if (followerIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this writer'
      });
    }

    // Remove user from followers
    writer.followers.splice(followerIndex, 1);
    await writer.updateFollowerCount();

    res.status(200).json({
      success: true,
      message: 'Successfully unfollowed writer',
      data: writer
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob