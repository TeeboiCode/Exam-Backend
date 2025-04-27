/**
 * PayPal Configuration
 * Sets up PayPal client with environment-specific credentials
 */

const paypal = require("@paypal/checkout-server-sdk");

// Creating an environment
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Registration fee in Naira
const REGISTRATION_FEE = 2000;

module.exports = {
  paypalConfig: client,
  REGISTRATION_FEE,
};
