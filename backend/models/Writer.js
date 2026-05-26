const mongoose = require('mongoose');

const writerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a writer name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  image: {
    type: String,
    default: 'default-writer.jpg'
  },
  nationality: {
    type: String,
    trim: true
  },
  birthDate: {
    type: Date
  },
  genres: [{
    type: String,
    trim: true
  }],
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  recentWorks: [{
    title: {
      type: String,
      trim: true
    },
    year: {
      type: Number
    },
    description: {
      type: String,
      trim: true
    }
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  socialMedia: {
    website: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  awards: [{
    name: String,
    year: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  followerCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update follower count
writerSchema.methods.updateFollowerCount = function() {
  this.followerCount = this.followers.length;
  return this.save();
};

module.exports = mongoose.model('Writer', writerSchema);

// Made with Bob