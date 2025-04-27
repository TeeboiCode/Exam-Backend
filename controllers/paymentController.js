const paypal = require("@paypal/checkout-server-sdk");
const client = require("../config/paypal");

// Create PayPal order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, description, userData } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: description,
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
        user_action: "PAY_NOW",
      },
    });

    const order = await client.execute(request);
    res.json(order.result);
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};

// Capture PayPal payment
exports.capturePayment = async (req, res) => {
  try {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);

    if (capture.result.status === "COMPLETED") {
      // Update user payment status in database
      // TODO: Implement database update

      res.json({
        status: "success",
        message: "Payment captured successfully",
        capture: capture.result,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Payment not completed",
      });
    }
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    res.status(500).json({ error: "Failed to capture payment" });
  }
};
