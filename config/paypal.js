/**
 * PayPal Configuration Module
 * Sets up PayPal SDK client for server-side operations
 */

const paypal = require("@paypal/checkout-server-sdk");

// Create PayPal environment
const environment =
  process.env.NODE_ENV === "production"
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_SECRET
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_SECRET
      );

// Create PayPal client
const client = new paypal.core.PayPalHttpClient(environment);

// Log PayPal configuration
console.log("PayPal Configuration:", {
  environment: process.env.NODE_ENV,
  clientId: process.env.PAYPAL_CLIENT_ID ? "Set" : "Not Set",
  secret: process.env.PAYPAL_SECRET ? "Set" : "Not Set",
  baseUrl: process.env.PAYPAL_BASE_URL,
});

module.exports = { client };
