const pool = require("../config/db");

/**
 * Add item to wishlist
 */
const addToWishlist = async (user_id, product_id) => {
  await pool.query(
    "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)",
    [user_id, product_id]
  );

  return {
    message: "Item added to wishlist"
  };
};

/**
 * Get wishlist items for user
 */
const getWishlist = async (user_id) => {
  const [items] = await pool.query(
    `SELECT 
       w.wishlist_id,
       i.item_id,
       i.item_name,
       i.price,
       i.category_id,
       c.category_name
     FROM wishlist w
     JOIN items i ON i.item_id = w.product_id
     JOIN categories c ON c.category_id = i.category_id
     WHERE w.user_id = ?`,
    [user_id]
  );

  return items;
};

/**
 * Remove item from wishlist
 */
const removeFromWishlist = async (user_id, product_id) => {
  const [result] = await pool.query(
    "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
    [user_id, product_id]
  );

  if (result.affectedRows === 0) {
    throw { status: 404, message: "Item not found in wishlist" };
  }

  return {
    message: "Item removed from wishlist"
  };
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};

