/**
 * PayPal Configuration
 * Sets up PayPal client with environment-specific credentials
 */

// PayPal configuration
const paypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_SECRET,
  mode: process.env.NODE_ENV === "production" ? "live" : "sandbox",
};

// Registration fee in Naira
const REGISTRATION_FEE = 2000;

module.exports = {
  paypalConfig,
  REGISTRATION_FEE,
};
