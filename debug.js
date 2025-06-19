/**
 * Debug script for testing PayPal integration
 */
require("dotenv").config();
const axios = require("axios");

// Display environment variables
console.log("Environment check:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- PAYPAL_BASE_URL:", process.env.PAYPAL_BASE_URL);
console.log(
  "- PAYPAL_CLIENT_ID:",
  process.env.PAYPAL_CLIENT_ID ? "Set" : "Not set"
);
console.log(
  "- PAYPAL_CLIENT_SECRET:",
  process.env.PAYPAL_CLIENT_SECRET ? "Set" : "Not set"
);

// Always use sandbox for this test
const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

/**
 * Generate PayPal access token
 * @returns {Promise<string>} Access token
 */
async function generateAccessToken() {
  try {
    console.log("\nGenerating PayPal access token...");

    const response = await axios({
      url: PAYPAL_BASE_URL + "/v1/oauth2/token",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en_US",
      },
      data: "grant_type=client_credentials",
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
    });

    console.log("✓ Access token generated successfully!");
    return response.data.access_token;
  } catch (error) {
    console.error("✗ Error generating access token:", {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Create a PayPal order
 * @param {string} accessToken PayPal access token
 * @param {number} amount Payment amount
 * @returns {Promise<Object>} Order details
 */
async function createOrder(accessToken, amount = 2.5) {
  try {
    console.log("\nCreating PayPal order...");

    const response = await axios({
      url: PAYPAL_BASE_URL + "/v2/checkout/orders",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toString(),
            },
          },
        ],
      },
    });

    console.log("✓ Order created successfully:", response.data.id);
    return response.data;
  } catch (error) {
    console.error("✗ Error creating order:", {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Run the test
 */
async function runTest() {
  try {
    // Generate token
    const token = await generateAccessToken();
    console.log("Token received:", token.substring(0, 10) + "...");

    // Create an order
    const order = await createOrder(token);
    console.log("Order details:", {
      id: order.id,
      status: order.status,
      links: order.links,
    });

    console.log("\n✓ TEST SUCCESSFUL");
  } catch (err) {
    console.error("\n✗ TEST FAILED:", err.message);
    process.exit(1);
  }
}

// Run the test
runTest();
