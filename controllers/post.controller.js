const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");

// CREATE a post
module.exports.createPost = async (req, res) => {
  const newPost = new PostModel(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// UPDATE a post
module.exports.updatePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await PostModel.updateOne({
        $set: req.body,
      });
      res.status(200).json("Post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// DELETE a post
module.exports.deletePost = async (req, res) => {
  try {
    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Post has been deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// LIKE/DISLIKE a post
module.exports.likePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("post has been liked successfully");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("post has been disliked successfully");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET a post
module.exports.getPost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET timeline posts
module.exports.getTimeline = async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.body.userId);
    const userPosts = await PostModel.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return PostModel.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
};
