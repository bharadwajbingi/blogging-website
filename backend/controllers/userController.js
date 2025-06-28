import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Post from '../models/Post.js';

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user.id);

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const postsCount = await Post.countDocuments({ author: user._id, published: true });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        postsCount,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalPosts, publishedPosts, draftPosts, totalViews] = await Promise.all([
      Post.countDocuments({ author: userId }),
      Post.countDocuments({ author: userId, published: true }),
      Post.countDocuments({ author: userId, published: false }),
      Post.aggregate([
        { $match: { author: userId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ])
    ]);

    const recentPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt views published');

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalPosts,
          publishedPosts,
          draftPosts,
          totalViews: totalViews[0]?.totalViews || 0
        },
        recentPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard'
    });
  }
};