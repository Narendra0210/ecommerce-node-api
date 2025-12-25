const pool = require("../config/db");

// ➕ Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and product_id are required"
      });
    }

    await pool.query(
      "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)",
      [user_id, product_id]
    );

    res.json({
      success: true,
      message: "Item added to wishlist"
    });

  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// 📦 Get Wishlist Items
exports.getWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

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

    res.json({
      success: true,
      data: items
    });

  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



// ❌ Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
      const { user_id, product_id } = req.body;
  
      if (!user_id || !product_id) {
        return res.status(400).json({
          success: false,
          message: "user_id and product_id are required"
        });
      }
  
      const [result] = await pool.query(
        "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
        [user_id, product_id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Item not found in wishlist"
        });
      }
  
      res.json({
        success: true,
        message: "Item removed from wishlist"
      });
  
    } catch (error) {
      console.error("Remove wishlist error:", error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };
  
