// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
// const router = express.Router();

// router.use(ClerkExpressWithAuth());

// // Register
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ username, email, password: hashedPassword });
//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (err) {
//     res.status(400).json({ error: 'Registration failed', details: err.message });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { username } });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     res.status(200).json({ message: 'Login successful', token });
//   } catch (err) {
//     res.status(400).json({ error: 'Login failed', details: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Registration failed", details: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: "Login failed", details: err.message });
  }
});

module.exports = router;
