const axios = require("axios");

async function generateAccessToken() {
  try {
    console.log("Generating PayPal access token");
    const baseUrl = "https://api-m.sandbox.paypal.com";
    console.log("Using PayPal base URL:", baseUrl);

    const response = await axios({
      url: baseUrl + "/v1/oauth2/token",
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

    console.log("Access token generated successfully");
    return response.data.access_token;
  } catch (error) {
    console.error("Error generating access token:", {
      message: error.message,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      stack: error.stack,
    });
    throw error;
  }
}

async function createOrder(amount, currency = "USD") {
  try {
    const accessToken = await generateAccessToken();
    const baseUrl = "https://api-m.sandbox.paypal.com";

    console.log("Creating PayPal order:", { amount, currency });
    const response = await axios({
      url: baseUrl + "/v2/checkout/orders",
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
              currency_code: currency,
              value: amount.toString(),
            },
          },
        ],
      },
    });

    console.log("PayPal order created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", {
      message: error.message,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      stack: error.stack,
    });
    throw error;
  }
}

async function capturePayment(orderId) {
  try {
    console.log("Starting payment capture for order:", orderId);
    const accessToken = await generateAccessToken();
    console.log("Access token generated successfully");

    const baseUrl = "https://api-m.sandbox.paypal.com";
    console.log(
      `Capturing payment at URL: ${baseUrl}/v2/checkout/orders/${orderId}/capture`
    );

    const response = await axios({
      url: `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {},
    });

    console.log("Payment captured successfully:", {
      status: response.status,
      statusText: response.statusText,
    });
    return response.data;
  } catch (error) {
    console.error("Error capturing payment:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
      orderId: orderId,
    });
    throw error;
  }
}

module.exports = {
  createOrder,
  capturePayment,
};
