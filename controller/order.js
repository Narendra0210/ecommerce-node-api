const pool = require("../config/db");

/* ============================
   GENERATE ORDER NUMBER
   ============================ */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

/* ============================
   PLACE ORDER
   ============================ */
exports.placeOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const user_id = req.params.user_id;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    // Check if user exists
    const [userCheck] = await connection.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [user_id]
    );

    if (userCheck.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get cart items for this user
    const [cartItems] = await connection.query(
      `SELECT 
         oi.order_item_id,
         oi.product_id,
         oi.quantity,
         oi.price,
         oi.total_price
       FROM order_items oi
       WHERE oi.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Cannot place order."
      });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    // Generate unique order number
    let orderNumber;
    let isUnique = false;
    while (!isUnique) {
      orderNumber = generateOrderNumber();
      const [existing] = await connection.query(
        "SELECT order_id FROM orders WHERE order_number = ?",
        [orderNumber]
      );
      if (existing.length === 0) {
        isUnique = true;
      }
    }

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_number, user_id, status, total_amount)
       VALUES (?, ?, 'pending', ?)`,
      [orderNumber, user_id, totalAmount]
    );

    const orderId = orderResult.insertId;

    // Move cart items to order (you can keep them in order_items with order_id, or create order_items table)
    // For now, we'll update order_items to link them to the order
    // If you have a separate order_items table, you would insert there instead
    
    // Update order_items to link to this order
    await connection.query(
      `UPDATE order_items 
       SET order_id = ?
       WHERE user_id = ? AND order_id IS NULL`,
      [orderId, user_id]
    );

    // Optionally: Clear cart after order is placed
    await connection.query(
      "DELETE FROM order_items WHERE user_id = ? AND order_id = ?",
      [user_id, orderId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        order_id: orderId,
        order_number: orderNumber,
        user_id: parseInt(user_id),
        status: 'pending',
        total_amount: totalAmount,
        items_count: cartItems.length
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error("Place order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/* ============================
   GET USER ORDERS
   ============================ */
exports.getUserOrders = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    const [orders] = await pool.query(
      `SELECT 
         o.order_id,
         o.order_number,
         o.user_id,
         o.status,
         o.total_amount,
         o.created_at,
         o.updated_at,
         COUNT(oi.order_item_id) as items_count
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.order_id
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ============================
   GET ORDER DETAILS
   ============================ */
exports.getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    // Get order info
    const [orders] = await pool.query(
      `SELECT 
         o.order_id,
         o.order_number,
         o.user_id,
         o.status,
         o.total_amount,
         o.created_at,
         o.updated_at
       FROM orders o
       WHERE o.order_id = ?`,
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Get order items
    const [items] = await pool.query(
      `SELECT 
         oi.order_item_id,
         oi.product_id,
         i.item_name,
         oi.quantity,
         oi.price,
         oi.total_price
       FROM order_items oi
       JOIN items i ON i.item_id = oi.product_id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    res.json({
      success: true,
      data: {
        ...orders[0],
        items: items
      }
    });

  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ============================
   CLOSE/COMPLETE ORDER
   ============================ */
exports.closeOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    // Check if order exists
    const [orders] = await pool.query(
      "SELECT order_id, status FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const currentStatus = orders[0].status;

    // Check if order is already closed/completed
    if (currentStatus === 'completed' || currentStatus === 'closed') {
      return res.status(400).json({
        success: false,
        message: `Order is already ${currentStatus}`
      });
    }

    // Update order status to completed
    await pool.query(
      `UPDATE orders 
       SET status = 'completed', updated_at = NOW()
       WHERE order_id = ?`,
      [order_id]
    );

    res.json({
      success: true,
      message: "Order closed successfully",
      data: {
        order_id: parseInt(order_id),
        status: 'completed'
      }
    });

  } catch (error) {
    console.error("Close order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

