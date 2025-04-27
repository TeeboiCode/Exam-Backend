/**
 * Student Routes
 * Handles student registration and payment processing
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { paypalConfig, REGISTRATION_FEE } = require("../config/paypal");
const studentController = require("../controllers/studentController");

const paypal = require("@paypal/checkout-server-sdk");

/**
 * Initialize PayPal client
 * @returns {Object} PayPal client instance
 */
function getPayPalClient() {
  const environment = new paypal.core.SandboxEnvironment(
    paypalConfig.clientId,
    paypalConfig.clientSecret
  );
  return new paypal.core.PayPalHttpClient(environment);
}

/**
 * Create PayPal order for registration fee
 * @route POST /api/student/create-order
 */
router.post("/create-order", async (req, res) => {
  try {
    const client = await getPayPalClient();

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: (REGISTRATION_FEE / 1000).toString(),
          },
          description: "Student Registration Fee",
        },
      ],
    });

    const order = await client.execute(request);

    // Find the approval URL in the response
    const approvalUrl = order.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.json({
      orderId: order.result.id,
      approvalUrl: approvalUrl,
    });
  } catch (error) {
    console.error("PayPal order creation error:", error);
    res.status(500).json({ message: "Error creating PayPal order" });
  }
});

/**
 * Capture PayPal payment and create student account
 * @route POST /api/student/capture-payment
 */
router.post("/capture-payment", async (req, res) => {
  try {
    const { orderId, userData } = req.body;

    // Validate registration data first
    const validation = validateRegistrationData(userData);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const client = await getPayPalClient();

    // Capture the payment
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await client.execute(request);

    if (capture.result.status === "COMPLETED") {
      // Create student account
      const student = await User.create({
        ...userData,
        role: "student",
        isActive: true,
      });

      res.json({
        message: "Registration successful",
        user: {
          id: student.id,
          email: student.email,
          username: student.username,
          role: student.role,
        },
      });
    } else {
      throw new Error("Payment not completed");
    }
  } catch (error) {
    console.error("Payment capture error:", error);
    res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
});

/**
 * Validate student registration data
 * @param {Object} data - Student registration data
 * @returns {Object} Validation result
 */
function validateRegistrationData(data) {
  const errors = [];

  if (!data.email || !data.email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!data.username || data.username.length < 3) {
    errors.push("Username must be at least 3 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Student registration
router.post("/register", studentController.registerStudent);

// Payment endpoints
router.post("/create-payment", studentController.createPayment);
router.post("/payment-success", studentController.handlePaymentSuccess);

module.exports = router;
