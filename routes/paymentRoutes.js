const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Create PayPal order
router.post("/create-order", paymentController.createOrder);

// Capture PayPal payment
router.post("/capture-payment", paymentController.capturePayment);

module.exports = router;
