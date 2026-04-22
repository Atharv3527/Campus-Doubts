import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import Resource from "../models/Resource.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, branch, year, bio } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      branch,
      year,
      bio,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      branch: user.branch,
      year: user.year,
      bio: user.bio,
      role: user.role,
      avatar: user.avatar, // 👈 add this
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      branch: user.branch,
      year: user.year,
      bio: user.bio,
      role: user.role,
      avatar: user.avatar, // 👈 add this
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user is set in authMiddleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    console.error("GetMe error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.branch = req.body.branch ?? user.branch;
    user.year = req.body.year ?? user.year;

    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const updated = await user.save();

    // return same shape as login/google
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      branch: updated.branch,
      year: updated.year,
      token: generateToken(updated._id),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Google auth

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    // find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        password: null,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (!user.avatar) user.avatar = picture;
      await user.save();
    }

    // 🔥 IMPORTANT: generate JWT exactly like normal login
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token, // 👈 this MUST exist
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


// GET /api/auth/stats
export const getMyStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [questions, answers, resources] = await Promise.all([
      Question.countDocuments({ askedBy: userId }),
      Answer.countDocuments({ answeredBy: userId }),
      Resource.countDocuments({ addedBy: userId }),
    ]);

    res.json({
      questions,
      answers,
      resources,
    });
  } catch (err) {
    next(err);
  }
};
