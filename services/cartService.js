const pool = require("../config/db");

/**
 * Add or update cart item
 */
const addCartItem = async (user_id, product_id, quantity, price) => {
  // Check if item exists for this user with status='cart'
  const [cartRows] = await pool.query(
    `SELECT order_item_id, status
     FROM order_items 
     WHERE user_id = ? AND product_id = ? AND status = 'cart'`,
    [user_id, product_id]
  );

  // REMOVE ITEM
  if (quantity === 0) {
    await pool.query(
      `DELETE FROM order_items 
       WHERE user_id = ? AND product_id = ? AND status = 'cart'`,
      [user_id, product_id]
    );

    return {
      message: "Item removed from cart"
    };
  }

  // UPDATE ITEM - if exists with status='cart', update it
  if (cartRows.length > 0) {
    await pool.query(
      `UPDATE order_items
       SET quantity = ?, 
           total_price = ?, 
           updated_at = NOW()
       WHERE user_id = ? AND product_id = ? AND status = 'cart' AND order_item_id = ?`,
      [quantity, quantity * price, user_id, product_id, cartRows[0].order_item_id]
    );

    return {
      message: "Cart updated"
    };
  }

  // Check if item exists with status='ordered'
  const [orderedRows] = await pool.query(
    `SELECT order_item_id, status
     FROM order_items 
     WHERE user_id = ? AND product_id = ? AND status = 'ordered'`,
    [user_id, product_id]
  );

  // Insert new cart item
  await pool.query(
    `INSERT INTO order_items
     (user_id, product_id, quantity, price, total_price, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, product_id, quantity, price, quantity * price, 'cart']
  );

  return {
    message: "Item added to cart"
  };
};

/**
 * Get cart items for user
 */
const getCartItems = async (user_id) => {
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
     WHERE oi.user_id = ? and oi.status = 'cart'`,
    [user_id]
  );

  return items;
};

module.exports = {
  addCartItem,
  getCartItems
};

