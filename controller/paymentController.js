const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

    // 1️⃣ Get order from DB
    const [orders] = await pool.query(
      "SELECT order_number, total_amount FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const order = orders[0];

    // 2️⃣ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: order.total_amount * 100, // paise
      currency: "INR",
      receipt: order.order_number
    });

    // 3️⃣ Save razorpay_order_id
    await pool.query(
      "UPDATE orders SET razorpay_order_id = ?, status = 'PENDING' WHERE order_id = ?",
      [razorpayOrder.id, order_id]
    );

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      id: razorpayOrder.id,
      razorpayOrder
    });

  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
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

      // Get order from database
      const [orders] = await pool.query(
        "SELECT order_id, status, total_amount FROM orders WHERE razorpay_order_id = ?",
        [razorpay_order_id]
      );

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      const order = orders[0];

      // Check if payment status is provided and indicates failure
      if (payment_status && (payment_status === 'failed' || payment_status === 'cancelled')) {
        // Update order status to FAILED
        await pool.query(
          `UPDATE orders
           SET status = 'FAILED',
               razorpay_payment_id = ?
           WHERE razorpay_order_id = ?`,
          [razorpay_payment_id, razorpay_order_id]
        );

        return res.status(400).json({
          success: false,
          message: "Payment failed or cancelled",
          payment_status: payment_status
        });
      }

      // Verify payment signature (only if payment is successful)
      if (razorpay_signature) {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSign = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(sign)
          .digest("hex");
    
        if (expectedSign !== razorpay_signature) {
          // Update order status to FAILED due to invalid signature
          await pool.query(
            `UPDATE orders
             SET status = 'FAILED',
                 razorpay_payment_id = ?
             WHERE razorpay_order_id = ?`,
            [razorpay_payment_id, razorpay_order_id]
          );

          return res.status(400).json({
            success: false,
            message: "Invalid payment signature - Payment verification failed"
          });
        }
      }

      // Fetch payment details from Razorpay to verify payment status
      try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        
        // Check payment status
        if (payment.status === 'failed' || payment.status === 'cancelled') {
          // Update order status to FAILED
          await pool.query(
            `UPDATE orders
             SET status = 'FAILED',
                 razorpay_payment_id = ?
             WHERE razorpay_order_id = ?`,
            [razorpay_payment_id, razorpay_order_id]
          );

          return res.status(400).json({
            success: false,
            message: `Payment ${payment.status}`,
            payment_status: payment.status,
            payment_error: payment.error_description || payment.error_reason
          });
        }

        // Verify payment amount matches order amount
        const paymentAmount = payment.amount / 100; // Convert from paise to rupees
        if (paymentAmount !== parseFloat(order.total_amount)) {
          // Update order status to FAILED due to amount mismatch
          await pool.query(
            `UPDATE orders
             SET status = 'FAILED',
                 razorpay_payment_id = ?
             WHERE razorpay_order_id = ?`,
            [razorpay_payment_id, razorpay_order_id]
          );

          return res.status(400).json({
            success: false,
            message: "Payment amount mismatch",
            expected_amount: order.total_amount,
            received_amount: paymentAmount
          });
        }

        // ✅ Payment is successful - Update order status to PAID
        await pool.query(
          `UPDATE orders
           SET status = 'PAID',
               razorpay_payment_id = ?
           WHERE razorpay_order_id = ?`,
          [razorpay_payment_id, razorpay_order_id]
        );

        res.json({
          success: true,
          message: "Payment verified and order settled",
          payment_status: payment.status
        });

      } catch (razorpayError) {
        // If we can't fetch payment details, mark as failed
        await pool.query(
          `UPDATE orders
           SET status = 'FAILED',
               razorpay_payment_id = ?
           WHERE razorpay_order_id = ?`,
          [razorpay_payment_id, razorpay_order_id]
        );

        return res.status(400).json({
          success: false,
          message: "Unable to verify payment with Razorpay",
          error: razorpayError.message
        });
      }
  
    } catch (error) {
      console.error("Verify payment error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };
  