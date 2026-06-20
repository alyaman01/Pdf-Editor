const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });
};

// 📝 SIGNUP LOGIC
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Saari fields bharna zaroori hai bhai!" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Ye email pehle se registered hai bhai!" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        message: "Signup successfully completed! 🎉",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Signup mein gadbad hui:", error: error.message });
  }
};

// 🔑 LOGIN LOGIC
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email aur Password dono chahiye bhai!" });
    }

    const user = await User.findOne({ email });

    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        message: "Login successful! Welcome back! 🚀",
      });
    } else {
      res.status(401).json({ message: "Galt Email ya Password daala hai aapne!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failure:", error: error.message });
  }
};