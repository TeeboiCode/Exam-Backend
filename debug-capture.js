/**
 * Debug script for testing PayPal payment capture
 */
require("dotenv").config();
const { capturePayment } = require("./services/paypalService");

// Get the order ID from command line arguments
const orderId = process.argv[2];

if (!orderId) {
  console.error("Please provide an order ID as a command line argument");
  console.error("Example: node debug-capture.js 13X08062BU169025R");
  process.exit(1);
}

// Test the payment capture
async function testCapture() {
  try {
    console.log(`Testing payment capture for order: ${orderId}`);
    const result = await capturePayment(orderId);
    console.log("Capture successful!");
    console.log("Result:", JSON.stringify(result, null, 2));
    console.log("\n✅ TEST SUCCESSFUL");
  } catch (error) {
    console.error("Capture failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    }
    console.error("\n❌ TEST FAILED");
    process.exit(1);
  }
}

testCapture();
