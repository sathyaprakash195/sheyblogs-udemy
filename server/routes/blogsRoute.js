const router = require("express").Router();
const Blog = require("../models/blogsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Like = require("../models/likesModel");
const Comment = require("../models/commentsModel");
const Share = require("../models/sharesModel");

// add new blog
router.post("/add-blog", authMiddleware, async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.send({
      message: "Blog added successfully",
      data: newBlog,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all blogs
router.get("/get-all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user").sort({ createdAt: -1 });
    res.send({
      message: "Blogs fetched successfully",
      data: blogs,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get blog by id
router.get("/get-blog-by-id/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user");
    res.send({
      message: "Blog fetched successfully",
      data: blog,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// update blog
router.put("/update-blog/:id", authMiddleware, async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      message: "Blog updated successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// delete blog
router.delete("/delete-blog/:id", authMiddleware, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.send({
      message: "Blog deleted successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all blogs by user
router.get("/get-all-blogs-by-user", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.body.userId }).sort({
      createdAt: -1,
    });
    res.send({
      message: "Blogs fetched successfully",
      data: blogs,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all blogs by liked by user
router.get(
  "/get-all-blogs-by-liked-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const likes = await Like.find({ user: req.body.userId }).populate({
        path: "blog",
        populate: {
          path: "user",
        },
      });
      res.send({
        message: "Blogs fetched successfully",
        data: likes,
        success: true,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  }
);

// get all blogs by commented by user
router.get(
  "/get-all-blogs-by-commented-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const blogs = await Comment.find({
        user: req.body.userId,
      }).populate({
        path: "blog",
        populate: {
          path: "user",
        },
      });
      res.send({
        message: "Blogs fetched successfully",
        data: blogs,
        success: true,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  }
);

// get all blogs by shared by user
router.get(
  "/get-all-blogs-by-shared-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const blogs = await Share.find({
        sender: req.body.userId,
      })
        .populate({
          path: "blog",
          populate: {
            path: "user",
          },
        })
        .populate("receiver")
        .sort({ createdAt: -1 });
      res.send({
        message: "Blogs fetched successfully",
        data: blogs,
        success: true,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  }
);

// get all blogs by shared to user
router.get(
  "/get-all-blogs-by-shared-to-user",
  authMiddleware,
  async (req, res) => {
    try {
      const blogs = await Share.find({
        receiver: req.body.userId,
      })
        .populate({
          path: "blog",
          populate: {
            path: "user",
          },
        })
        .populate("sender")
        .sort({ createdAt: -1 });
      res.send({
        message: "Blogs fetched successfully",
        data: blogs,
        success: true,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  }
);
module.exports = router;
