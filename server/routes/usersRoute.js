const User = require("../models/usersModel");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Notification = require("../models/notificationsModel");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    // check if the user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // create a new user
    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: "User Registered Successfully , Please login to continue",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist",
      });
    }

    // check if the password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    // create and assign a token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.jwt_secret,
      {
        expiresIn: "1d",
      }
    );

    // send the token to the client
    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get user details from token
router.get("/getuser", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// search for a user
router.post("/search-users", authMiddleware, async (req, res) => {
  try {
    const searchText = req.body.searchText;

    // search for users with the given search text in their name
    const users = await User.find({
      name: {
        $regex: searchText,
        $options: "i",
      },
      _id: {
        $ne: req.body.userId,
      },
    });

    res.send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all notifications for a user

router.get("/get-all-notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({
      createdAt: -1,
    });

    res.send({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// mark all notifications as read
router.post(
  "/mark-all-notifications-as-read",
  authMiddleware,
  async (req, res) => {
    try {
     await Notification.updateMany(
        {
          user: req.body.userId,
        },
        {
          $set: {
            read: true,
          },
        }
      );

      const updatedNotifications = await Notification.find({
        user: req.body.userId,
      }).sort({ createdAt: -1 });
      res.send({
        success: true,
        message: "Notifications marked as read successfully",
        data: updatedNotifications,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
