const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const { setUser } = require("../service/auth");
require('dotenv').config();

const handleUserSignup = async (req, res) => {
  try {
    const { name, password, role } = req.body;

    const newUser = new User({
      name,
      password,
      role,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email is already registered. Please use a different email address." });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

async function handleUserLogin(req, res) {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials. Please check your user and password and try again." });
    }

    const token = jwt.sign(
      { user_id: user._id, name, role: user.role },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    setUser(token, user);
    const resObject = {
      userId: user._id,
      token,
      role: user.role,
      name: user.name,
    };

    return res.json(resObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

async function handleDeleteEmployees(req, res) {
  try {
    const { userId } = req.params;

    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ error: "Permission denied. Only admins can perform this action." });
    }

    const deletedUsers = await User.deleteMany({ role: 'employee' });

    return res.json({ message: `Deleted ${deletedUsers.deletedCount} employee(s) successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleDeleteEmployees,
};
