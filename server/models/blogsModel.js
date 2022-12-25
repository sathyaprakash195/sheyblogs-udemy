const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    canShare: {
      type: Boolean,
      require: true,
    },
    canComment: {
      type: Boolean,
      require: true,
    },
    canLike: {
      type: Boolean,
      require: true,
    },
    likesCount: {
      type: Number,
      require: false,
      default: 0,
    },
    commentsCount: {
      type: Number,
      require: false,
      default: 0,
    },
    sharesCount: {
      type: Number,
      require: false,
      default: 0,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("blogs", blogSchema);