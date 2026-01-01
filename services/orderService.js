const pool = require("../config/db");

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

/**
 * Place order from cart
 */
const placeOrder = async (user_id) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check if user exists
    const [userCheck] = await connection.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [user_id]
    );

    if (userCheck.length === 0) {
      await connection.rollback();
      throw { status: 404, message: "User not found" };
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
       WHERE oi.user_id = ? and oi.status = 'cart'`,
      [user_id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      throw { status: 400, message: "Cart is empty. Cannot place order." };
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

    // Update order_items to link to this order and change status
    await connection.query(
      `UPDATE order_items 
       SET status = 'order', order_id = ?
       WHERE user_id = ? AND status = 'cart'`,
      [orderId, user_id]
    );

    await connection.commit();

    return {
      order_id: orderId,
      order_number: orderNumber,
      user_id: parseInt(user_id),
      status: 'pending',
      total_amount: totalAmount,
      items_count: cartItems.length
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get user orders
 */
const getUserOrders = async (user_id) => {
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

  return orders;
};

/**
 * Get order details
 */
const getOrderDetails = async (order_id) => {
  // Get order info
  const [orders] = await pool.query(
    `SELECT 
       o.order_id,
       o.order_number,
       o.user_id,
       o.status,
       o.ordered_status,
       o.total_amount,
       o.created_at,
       o.updated_at
     FROM orders o
     WHERE o.order_id = ?`,
    [order_id]
  );

  if (orders.length === 0) {
    throw { status: 404, message: "Order not found" };
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
     WHERE oi.order_id = ? and oi.status = 'order'`,
    [order_id]
  );

  return {
    ...orders[0],
    items: items
  };
};

/**
 * Close/complete order
 */
const closeOrder = async (order_id) => {
  // Check if order exists
  const [orders] = await pool.query(
    "SELECT order_id, status FROM orders WHERE order_id = ?",
    [order_id]
  );

  if (orders.length === 0) {
    throw { status: 404, message: "Order not found" };
  }

  const currentStatus = orders[0].status;

  // Check if order is already closed/completed
  if (currentStatus === 'completed' || currentStatus === 'closed') {
    throw { status: 400, message: `Order is already ${currentStatus}` };
  }

  // Update order status to completed
  await pool.query(
    `UPDATE orders 
     SET status = 'completed', updated_at = NOW()
     WHERE order_id = ?`,
    [order_id]
  );

  return {
    order_id: parseInt(order_id),
    status: 'completed'
  };
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderDetails,
  closeOrder
};

