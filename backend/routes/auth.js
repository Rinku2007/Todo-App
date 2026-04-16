const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed
    });

    await user.save();

    res.json({ msg: "Signup successful ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Signup error ❌" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Login error ❌" });
  }
});

module.exports = router;