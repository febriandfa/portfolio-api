const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../model/models");
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token: token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err });
  }
});

module.exports = router;
