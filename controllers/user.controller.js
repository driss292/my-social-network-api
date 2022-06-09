const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  //   console.log(req.params);
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log(`ID unknown : ${req.params.id}`);
    }
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }

  try {
    const updatedBio = await UserModel.findOneAndUpdate(
      req.params.id,
      req.body
    );
    res.send({ message: "bio has been updated", result: updatedBio });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted !" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  ) {
    return res.status(400).send(`ID unknown : ${req.params.id}`);
  }

  try {
    // Add to the follower list
    // const updatedFollower = await UserModel.findByIdAndUpdate(req.params.id);
    // updatedFollower.following = req.body.idToFollow;
    // res.send({ message: "follower has been updated", result: updatedFollower });
    /////////
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { following: req.body.idToFollow },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );

    // Add to following list
    // const updatedFollowing = await UserModel.findByIdAndUpdate(
    //   req.body.idToFollow
    // );
    // updatedFollowing.followers = req.params.id;
    // res.send({
    //   message: "following has been updated",
    //   result: updatedFollowing,
    // });
    ///////////////
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $push: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// module.exports.unfollow = async (req, res) => {
//   if (!ObjectID.isValid(req.params.id)) {
//     return res.status(400).send(`ID unknown : ${req.params.id}`);
//   }

//   try {
//   } catch (err) {
//     return res.status(500).json({ message: err });
//   }
// };
