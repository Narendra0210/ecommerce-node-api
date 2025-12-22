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

    // check if item exists for this user
    const [rows] = await pool.query(
      `SELECT order_item_id 
       FROM order_items 
       WHERE user_id = ? AND product_id = ?`,
      [user_id, product_id]
    );

    // REMOVE ITEM
    if (quantity === 0) {
      await pool.query(
        `DELETE FROM order_items 
         WHERE user_id = ? AND product_id = ?`,
        [user_id, product_id]
      );

      return res.json({
        success: true,
        message: "Item removed from cart"
      });
    }

    // UPDATE ITEM
    if (rows.length > 0) {
      await pool.query(
        `UPDATE order_items
         SET quantity = ?, 
             total_price = ?, 
             updated_at = NOW()
         WHERE user_id = ? AND product_id = ?`,
        [quantity, quantity * price, user_id, product_id]
      );

      return res.json({
        success: true,
        message: "Cart updated"
      });
    }

    // INSERT ITEM
    await pool.query(
      `INSERT INTO order_items
       (user_id, product_id, quantity, price, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, product_id, quantity, price, quantity * price]
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
       WHERE oi.user_id = ?`,
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
