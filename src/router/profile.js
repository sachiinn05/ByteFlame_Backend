const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const { validateEditiProfileData } = require("../utils/validation.js");
const { upload } = require("../middleware/upload.js");

// View profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.post(
  "/profile/photo",
  userAuth,
  (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please choose an image" });
      }

      const photoUrl = `/uploads/${req.file.filename}`;
      req.user.photoUrl = photoUrl;
      await req.user.save();

      res.json({
        message: "Photo uploaded",
        photoUrl,
        data: req.user,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Edit profile
profileRouter.patch("/profile/editi", userAuth, async (req, res) => {
  try {
    if (!validateEditiProfileData(req)) {
      throw new Error("Invalid user request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
