const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create Razorpay order for existing order
 */
const createPaymentOrder = async (order_id) => {
  // Get order from DB
  const [orders] = await pool.query(
    "SELECT order_number, total_amount FROM orders WHERE order_id = ?",
    [order_id]
  );

  if (orders.length === 0) {
    throw { status: 404, message: "Order not found" };
  }

  const order = orders[0];

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: order.total_amount * 100, // paise
    currency: "INR",
    receipt: order.order_number
  });

  // Save razorpay_order_id
  await pool.query(
    "UPDATE orders SET razorpay_order_id = ?, status = 'PENDING' WHERE order_id = ?",
    [razorpayOrder.id, order_id]
  );

  return {
    key: process.env.RAZORPAY_KEY_ID,
    id: razorpayOrder.id,
    razorpayOrder
  };
};

/**
 * Verify payment
 */
const verifyPayment = async (paymentData) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    payment_status
  } = paymentData;

  // Get order from database
  const [orders] = await pool.query(
    "SELECT order_id, status, total_amount FROM orders WHERE razorpay_order_id = ?",
    [razorpay_order_id]
  );

  if (orders.length === 0) {
    throw { status: 404, message: "Order not found" };
  }

  const order = orders[0];

  // Check if payment status is provided and indicates failure
  if (payment_status && (payment_status === 'failed' || payment_status === 'cancelled')) {
    await pool.query(
      `UPDATE orders
       SET status = 'FAILED',
           razorpay_payment_id = ?
       WHERE razorpay_order_id = ?`,
      [razorpay_payment_id, razorpay_order_id]
    );

    throw { 
      status: 400, 
      message: "Payment failed or cancelled",
      payment_status: payment_status
    };
  }

  // Verify payment signature (only if payment is successful)
  if (razorpay_signature) {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      await pool.query(
        `UPDATE orders
         SET status = 'FAILED',
             razorpay_payment_id = ?
         WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_order_id]
      );

      throw { 
        status: 400, 
        message: "Invalid payment signature - Payment verification failed"
      };
    }
  }

  // Fetch payment details from Razorpay to verify payment status
  try {
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    // Check payment status
    if (payment.status === 'failed' || payment.status === 'cancelled') {
      await pool.query(
        `UPDATE orders
         SET status = 'FAILED',
             razorpay_payment_id = ?
         WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_order_id]
      );

      throw { 
        status: 400, 
        message: `Payment ${payment.status}`,
        payment_status: payment.status,
        payment_error: payment.error_description || payment.error_reason
      };
    }

    // Verify payment amount matches order amount
    const paymentAmount = payment.amount / 100; // Convert from paise to rupees
    if (paymentAmount !== parseFloat(order.total_amount)) {
      await pool.query(
        `UPDATE orders
         SET status = 'FAILED',
             razorpay_payment_id = ?
         WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_order_id]
      );

      throw { 
        status: 400, 
        message: "Payment amount mismatch",
        expected_amount: order.total_amount,
        received_amount: paymentAmount
      };
    }

    // Payment is successful - Update order status to PAID
    await pool.query(
      `UPDATE orders
       SET status = 'PAID',
           razorpay_payment_id = ?
       WHERE razorpay_order_id = ?`,
      [razorpay_payment_id, razorpay_order_id]
    );

    return {
      message: "Payment verified and order settled",
      payment_status: payment.status
    };

  } catch (razorpayError) {
    // If we can't fetch payment details, mark as failed
    await pool.query(
      `UPDATE orders
       SET status = 'FAILED',
           razorpay_payment_id = ?
       WHERE razorpay_order_id = ?`,
      [razorpay_payment_id, razorpay_order_id]
    );

    throw { 
      status: 400, 
      message: "Unable to verify payment with Razorpay",
      error: razorpayError.message
    };
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment
};

