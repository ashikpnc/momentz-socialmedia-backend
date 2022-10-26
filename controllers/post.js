const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body).save();
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "first_name last_name picture username gender")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const like = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (post.likes.includes(req.user.id)) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: req.user.id },
      });
      return res.json({ status: "ok" });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: req.user.id },
      });
      res.json({ status: "ok" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const galleryPosts = async (req, res) => {
  try {
    const galleryPosts = await Post.find();
    res.json(galleryPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const comment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: { comment, commentBy: req.user.id } },
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createPost,
  getAllPosts,
  like,
  galleryPosts,
  comment,
};
