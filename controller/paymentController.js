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
        razorpay_signature
      } = req.body;
  
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
  
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");
  
      if (expectedSign !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature"
        });
      }
  
      // ✅ Update order status to PAID
      await pool.query(
        `UPDATE orders
         SET status = 'PAID',
             razorpay_payment_id = ?
         WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_order_id]
      );
  
      res.json({
        success: true,
        message: "Payment verified and order settled"
      });
  
    } catch (error) {
      console.error("Verify payment error:", error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };
  