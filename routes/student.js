/**
 * Student Routes
 * Handles student registration and payment processing
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const paymentController = require("../controllers/paymentController");

/**
 * Student registration endpoint
 * @route POST /api/student/register
 */
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      maritalStatus,
      dob,
      state,
      localGovt,
      address,
      nationality,
      nin,
      department,
      gender,
      privacyPolicy,
      paymentStatus,
      paymentAmount,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !maritalStatus ||
      !dob ||
      !state ||
      !localGovt ||
      !address ||
      !nationality ||
      !nin ||
      !department ||
      !gender ||
      !privacyPolicy
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Create student record
    const student = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      maritalStatus,
      dob,
      state,
      localGovt,
      address,
      nationality,
      nin,
      department,
      gender,
      privacyPolicy,
      role: "student",
      isActive: true,
      paymentStatus: paymentStatus || "pending",
      paymentAmount: paymentAmount || 2.5,
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        id: student.id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        paymentStatus: student.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering student",
      error: error.message,
    });
  }
});

module.exports = router;
