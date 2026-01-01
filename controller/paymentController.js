const paymentService = require("../services/paymentService");

// 🔹 Create Razorpay Order for existing order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    const result = await paymentService.createPaymentOrder(order_id);

    res.json({
      success: true,
      key: result.key,
      id: result.id,
      razorpayOrder: result.razorpayOrder
    });

  } catch (error) {
    console.error("Create payment order error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_status
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "razorpay_order_id and razorpay_payment_id are required"
      });
    }

    const result = await paymentService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_status
    });

    res.json({
      success: true,
      message: result.message,
      payment_status: result.payment_status
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message,
      error: error.message,
      payment_status: error.payment_status,
      expected_amount: error.expected_amount,
      received_amount: error.received_amount
    });
  }
};
  