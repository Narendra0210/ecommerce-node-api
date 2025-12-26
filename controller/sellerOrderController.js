const pool = require("../config/db");

/* ============================
   GET PAID ORDER DETAILS WITH ITEMS (For Seller)
   ============================ */
exports.getPaidOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    // Get order details
    const [orders] = await pool.query(
      `SELECT 
         o.order_id,
         o.order_number,
         o.user_id,
         o.status,
         o.ordered_status,
         o.total_amount,
         o.razorpay_order_id,
         o.razorpay_payment_id,
         o.created_at,
         o.updated_at,
         u.full_name as customer_name,
         u.email as customer_email,
         u.mobile as customer_mobile
       FROM orders o
       LEFT JOIN users u ON u.user_id = o.user_id
       WHERE o.order_id = ? AND o.status = 'PAID'`,
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Paid order not found"
      });
    }

    // Get order items
    const [items] = await pool.query(
      `SELECT 
         oi.order_item_id,
         oi.product_id,
         i.item_name,
         i.price as item_price,
         oi.quantity,
         oi.price,
         oi.total_price,
         c.category_name
       FROM order_items oi
       JOIN items i ON i.item_id = oi.product_id
       LEFT JOIN categories c ON c.category_id = i.category_id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    res.json({
      success: true,
      data: {
        ...orders[0],
        items: items,
        items_count: items.length
      }
    });

  } catch (error) {
    console.error("Get paid order details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ============================
   GET ALL PAID ORDERS (For Seller)
   ============================ */
exports.getAllPaidOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
         o.order_id,
         o.order_number,
         o.user_id,
         o.status,
         o.ordered_status,
         o.total_amount,
         o.razorpay_order_id,
         o.razorpay_payment_id,
         o.created_at,
         o.updated_at,
         u.full_name as customer_name,
         u.email as customer_email,
         u.mobile as customer_mobile
       FROM orders o
       LEFT JOIN users u ON u.user_id = o.user_id
       WHERE o.status = 'PAID'
       ORDER BY o.created_at DESC`
    );

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.query(
          `SELECT 
             oi.order_item_id,
             oi.product_id,
             i.item_name,
             i.price as item_price,
             oi.quantity,
             oi.price,
             oi.total_price,
             c.category_name
           FROM order_items oi
           JOIN items i ON i.item_id = oi.product_id
           LEFT JOIN categories c ON c.category_id = i.category_id
           WHERE oi.order_id = ?`,
          [order.order_id]
        );

        return {
          ...order,
          items: items,
          items_count: items.length
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithItems,
      count: ordersWithItems.length
    });

  } catch (error) {
    console.error("Get all paid orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ============================
   UPDATE ORDERED STATUS (By Seller)
   ============================ */
exports.updateOrderedStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { ordered_status } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    if (!ordered_status) {
      return res.status(400).json({
        success: false,
        message: "ordered_status is required"
      });
    }

    // Valid status values
    const validStatuses = ['accepted', 'packed', 'shipped', 'delivered'];
    if (!validStatuses.includes(ordered_status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid ordered_status. Valid values: ${validStatuses.join(', ')}`
      });
    }

    // Check if order exists and is paid
    const [orders] = await pool.query(
      "SELECT order_id, status, ordered_status FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const order = orders[0];

    // Only allow status update for PAID orders
    if (order.status !== 'PAID') {
      return res.status(400).json({
        success: false,
        message: `Cannot update ordered_status. Order status must be 'PAID'. Current status: ${order.status}`
      });
    }

    // Update ordered_status
    await pool.query(
      `UPDATE orders 
       SET ordered_status = ?, updated_at = NOW()
       WHERE order_id = ? AND status = 'PAID'`,
      [ordered_status.toLowerCase(), order_id]
    );

    res.json({
      success: true,
      message: "Ordered status updated successfully",
      data: {
        order_id: parseInt(order_id),
        ordered_status: ordered_status.toLowerCase(),
        previous_status: order.ordered_status
      }
    });

  } catch (error) {
    console.error("Update ordered status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

