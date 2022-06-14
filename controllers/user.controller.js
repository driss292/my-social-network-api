const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

// GET all users
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// GET user
module.exports.userInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
};

// UPDATE user
module.exports.updateUser = async (req, res) => {
  if (req.body.id === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json(error);
      }
    }
    try {
      await UserModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    res.status(403).json("You can update only your account");
  }
};

// DELETE user
module.exports.deleteUser = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json("account has been deleted");
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// FOLLOW user
module.exports.follow = async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await UserModel.findById(req.params.id);
      const currentUser = await UserModel.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
};

// UNFOLLOW user
module.exports.unfollow = async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await UserModel.findById(req.params.id);
      const currentUser = await UserModel.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You can unfollow only the users you followed");
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
};
