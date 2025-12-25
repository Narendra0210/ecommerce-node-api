const pool = require("../config/db");

/* ============================
   ADD / UPDATE CART ITEM
   ============================ */
exports.addCartItem = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { product_id, quantity, price } = req.body;

    if (!product_id || quantity === undefined || !price) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Check if item exists for this user with status='cart' (user_id + product_id)
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

      return res.json({
        success: true,
        message: "Item removed from cart"
      });
    }

    // UPDATE ITEM - if exists with status='cart', update it
    if (cartRows.length > 0) {
      // Update the existing cart item (using order_item_id for uniqueness)
      await pool.query(
        `UPDATE order_items
         SET quantity = ?, 
             total_price = ?, 
             updated_at = NOW()
         WHERE user_id = ? AND product_id = ? AND status = 'cart' AND order_item_id = ?`,
        [quantity, quantity * price, user_id, product_id, cartRows[0].order_item_id]
      );

      return res.json({
        success: true,
        message: "Cart updated"
      });
    }

    // Check if item exists with status='ordered' (user_id + product_id)
    const [orderedRows] = await pool.query(
      `SELECT order_item_id, status
       FROM order_items 
       WHERE user_id = ? AND product_id = ? AND status = 'ordered'`,
      [user_id, product_id]
    );

    // If item exists with status='ordered', keep it and insert new cart item
    // The new insert will have a different order_item_id, so it will be unique
    // If item doesn't exist at all, insert new cart item
    await pool.query(
      `INSERT INTO order_items
       (user_id, product_id, quantity, price, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, product_id, quantity, price, quantity * price, 'cart']
    );

    res.json({
      success: true,
      message: "Item added to cart"
    });

  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   GET CART ITEMS FOR USER
   ============================ */
exports.getCartItems = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id parameter is required"
      });
    }

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

    res.json({
      success: true,
      data: items
    });

  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
