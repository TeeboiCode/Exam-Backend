/**
 * Authentication Routes
 * Handles user authentication, profile management, and user listing
 * Includes login, profile retrieval, and admin-only user management
 */

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const authorizeRole = require("../middleware/authorizeRole");

/**
 * Login Route
 * Authenticates user with email, password, and role
 * Returns JWT token and user information on successful login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role
    const user = await User.findOne({ where: { email, role } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or role" });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Generate JWT token with user information
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response with token and user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Profile Route
 * Protected route that returns the authenticated user's profile
 * Requires valid JWT token
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Find user by ID from token, excluding password
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Users List Route
 * Admin-only route that returns list of all users
 * Requires valid JWT token and admin/superadmin role
 */
router.get(
  "/users",
  verifyToken,
  authorizeRole("admin", "superadmin"),
  async (req, res) => {
    try {
      // Get all users, excluding passwords
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      res.json(users);
    } catch (error) {
      console.error("Users list error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/**
 * Logout Route
 * Clears the user's session/token
 * @route POST /api/auth/logout
 */
router.post("/logout", verifyToken, (req, res) => {
  try {
    // In a JWT-based system, logout is handled client-side by removing the token
    // This endpoint is mainly for consistency and future session-based implementations
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
