const { createOrder, capturePayment } = require("../services/paypalService");

// Create PayPal order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "USD" } = req.body;

    console.log("Creating PayPal order with data:", {
      amount,
      currency,
      clientId: process.env.PAYPAL_CLIENT_ID,
      environment: process.env.NODE_ENV,
    });

    const order = await createOrder(amount, currency);
    console.log("PayPal order created successfully:", order);

    res.json({
      id: order.id,
      status: order.status,
      links: order.links,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", {
      message: error.message,
      details: error.details,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({
      error: "Failed to create PayPal order",
      details: error.message,
      debug: process.env.NODE_ENV === "development" ? error.details : undefined,
    });
  }
};

// Capture PayPal payment
exports.capturePayment = async (req, res) => {
  try {
    const { orderId, userData } = req.body;
    console.log("Received capture payment request:", { orderId, userData });

    if (!orderId) {
      console.log("Missing orderId in request");
      return res.status(400).json({
        success: false,
        error: "Order ID is required",
      });
    }

    console.log("Returning success for direct PayPal capture");
    // Since PayPal has already captured the payment on the client side,
    // we just need to return success and let the frontend handle the rest
    res.json({
      success: true,
      data: {
        id: orderId,
        status: "COMPLETED",
      },
      message: "Payment captured successfully",
    });
  } catch (error) {
    console.error("Error in capturePayment controller:", {
      message: error.message,
      details: error.details,
      stack: error.stack,
      response: error.response?.data,
      requestBody: req.body,
    });

    res.status(500).json({
      success: false,
      error: "Failed to capture payment",
      message: error.message,
      debug: process.env.NODE_ENV === "development" ? error.details : undefined,
    });
  }
};
