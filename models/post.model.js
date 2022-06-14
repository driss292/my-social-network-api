const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
      default: "./uploads/post/random-post.png",
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("post", postSchema);

module.exports = PostModel;
