import Post from '../models/Post.js';

export const searchPosts = async (req, res) => {
  try {
    const { q, tags, author } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { published: true };

    if (q) {
      query.$text = { $search: q };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (author) {
      query.author = author;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      query: { q, tags, author }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $match: { published: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      tags: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching tags'
    });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      tags: tag.toLowerCase(),
      published: true
    })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Post.countDocuments({
      tags: tag.toLowerCase(),
      published: true
    });

    res.json({
      success: true,
      posts,
      tag,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching posts by tag'
    });
  }
};