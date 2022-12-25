const Like = require("../models/likesModel");
const Share = require("../models/sharesModel");
const Comment = require("../models/commentsModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Blog = require("../models/blogsModel");
const Notification = require("../models/notificationsModel");

// like a blog
router.post("/like-blog", authMiddleware, async (req, res) => {
  try {
    // add new like to likes collection
    const newLike = new Like(req.body);
    await newLike.save();

    // increment likes count in blog document
    await Blog.findByIdAndUpdate(req.body.blog, {
      $inc: { likesCount: 1 },
    });

    // add notification to notifications collection
    const newNotification = new Notification(req.body.notificationPayload);
    await newNotification.save();

    res.send({
      message: "Blog liked successfully",
      data: newLike,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// unlike a blog
router.post("/unlike-blog", authMiddleware, async (req, res) => {
  try {
    // delete like from likes collection
    await Like.findOneAndDelete(req.body);

    // decrement likes count in blog document
    await Blog.findByIdAndUpdate(req.body.blog, {
      $inc: { likesCount: -1 },
    });

    // add notification to notifications collection
    const newNotification = new Notification(req.body.notificationPayload);
    await newNotification.save();

    res.send({
      message: "Blog unliked successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all likes of a blog
router.get("/get-all-likes-of-blog/:id", async (req, res) => {
  try {
    const likes = await Like.find({ blog: req.params.id }).populate("user");
    res.send({
      message: "Likes fetched successfully",
      data: likes,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// add a comment
router.post("/add-comment", authMiddleware, async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();

    // increment comments count in blog document
    await Blog.findByIdAndUpdate(req.body.blog, {
      $inc: { commentsCount: 1 },
    });

    // add notification to notifications collection
    const newNotification = new Notification(req.body.notificationPayload);
    await newNotification.save();

    res.send({
      message: "Comment added successfully",
      data: newComment,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all comments of a blog
router.get("/get-all-comments-of-blog/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id })
      .populate("user")
      .sort({ createdAt: -1 });
    res.send({
      message: "Comments fetched successfully",
      data: comments,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// delete a comment
router.post("/delete-comment", authMiddleware, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.body.commentId);

    // decrement comments count in blog document
    await Blog.findByIdAndUpdate(req.body.blogId, {
      $inc: { commentsCount: -1 },
    });

    res.send({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// share a blog
router.post("/share-blog", authMiddleware, async (req, res) => {
  try {
    const { selectedUsers, blog, sender , senderName } = req.body;

    // share blog to all selected users
    for (let i = 0; i < selectedUsers.length; i++) {
      const newShare = new Share({
        blog,
        sender,
        receiver: selectedUsers[i],
      });
      await newShare.save();
    }

    // increment shares count in blog document
    await Blog.findByIdAndUpdate(blog, {
      $inc: { sharesCount: 1 },
    });

    // add notification to notifications collection

    for (let i = 0; i < selectedUsers.length; i++) {
      const newNotification = new Notification({
           user : selectedUsers[i],
           title : `${senderName} shared a blog with you`,
           read : false,
           onClick : `/blog-desc/${blog}`
      });
      await newNotification.save();
    }

    
    res.send({
      message: "Blog shared successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});
module.exports = router;
