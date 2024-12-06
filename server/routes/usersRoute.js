require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  let { username, email, password, confirmpassword } = req.body;

  if (!username || !email || !password || !confirmpassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Ensure unique username
    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      let suffix = 1;
      let newUsername = `${username}${suffix}`;
      while (await User.findOne({ username: newUsername })) {
        suffix++;
        newUsername = `${username}${suffix}`;
      }
      username = newUsername;
    }

    // Hash the password before saving
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, isAdmin: newUser.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
