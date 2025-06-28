import { validationResult } from "express-validator";
import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = req.query.author ? { author: req.query.author } : {};
    if (req.query.published !== undefined) {
      query.published = req.query.published === "true";
    }

    const posts = await Post.find(query)
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 })
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
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching posts",
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    })
      .populate("author", "name email avatar")
      .populate("comments.user", "name avatar");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching post",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, content, summary, tags } = req.body;

    const post = await Post.create({
      title,
      content,
      summary,
      tags: Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim()),
      author: req.user.id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name email avatar"
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating post",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    const { title, content, summary, tags, published } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.summary = summary || post.summary;
    post.tags = tags ? tags.split(",").map((tag) => tag.trim()) : post.tags;
    post.published = published !== undefined ? published : post.published;

    const updatedPost = await post.save();
    await updatedPost.populate("author", "name email avatar");

    res.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating post",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting post",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json({
      success: true,
      message: isLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
