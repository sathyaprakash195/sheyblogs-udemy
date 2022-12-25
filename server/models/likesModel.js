const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);


const likesModel = mongoose.model("likes", likesSchema);

module.exports = likesModel;