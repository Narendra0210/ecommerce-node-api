const pool = require("../config/db");

/**
 * Get paid order details with items (for seller)
 */
const getPaidOrderDetails = async (order_id) => {
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
    throw { status: 404, message: "Paid order not found" };
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

  return {
    ...orders[0],
    items: items,
    items_count: items.length
  };
};

/**
 * Get all paid orders (for seller)
 */
const getAllPaidOrders = async () => {
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

  return {
    orders: ordersWithItems,
    count: ordersWithItems.length
  };
};

/**
 * Update ordered status (by seller)
 */
const updateOrderedStatus = async (order_id, ordered_status) => {
  // Valid status values
  const validStatuses = ['accepted', 'packed', 'shipped', 'delivered'];
  if (!validStatuses.includes(ordered_status.toLowerCase())) {
    throw { 
      status: 400, 
      message: `Invalid ordered_status. Valid values: ${validStatuses.join(', ')}`
    };
  }

  // Check if order exists and is paid
  const [orders] = await pool.query(
    "SELECT order_id, status, ordered_status FROM orders WHERE order_id = ?",
    [order_id]
  );

  if (orders.length === 0) {
    throw { status: 404, message: "Order not found" };
  }

  const order = orders[0];

  // Only allow status update for PAID orders
  if (order.status !== 'PAID') {
    throw { 
      status: 400, 
      message: `Cannot update ordered_status. Order status must be 'PAID'. Current status: ${order.status}`
    };
  }

  // Update ordered_status
  await pool.query(
    `UPDATE orders 
     SET ordered_status = ?, updated_at = NOW()
     WHERE order_id = ? AND status = 'PAID'`,
    [ordered_status.toLowerCase(), order_id]
  );

  return {
    order_id: parseInt(order_id),
    ordered_status: ordered_status.toLowerCase(),
    previous_status: order.ordered_status
  };
};

module.exports = {
  getPaidOrderDetails,
  getAllPaidOrders,
  updateOrderedStatus
};

