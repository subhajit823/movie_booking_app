const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// Get current user + admin flag
router.get("/me", protect, async (req, res) => {
  try {
    const user = req.user;
    const raw = process.env.ADMIN_EMAILS || "";
    const adminEmails = raw.split(",").map(e => e.trim()).filter(Boolean);
    const isAdmin = adminEmails.includes(user.email);

    res.json({
      user: { _id: user._id, name: user.name, email: user.email },
      isAdmin
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user info" });
  }
});

//  Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email not found." });
    }

    const resetToken = generateToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `https://movie-booking-app-658h.vercel.app/reset-password/${resetToken}`; // Adjust frontend URL
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      html: `You are receiving this because you have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n<a href="${resetUrl}">${resetUrl}</a>\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send password reset email." });
  }
});

// ✅ Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password." });
  }
});

module.exports = router;
