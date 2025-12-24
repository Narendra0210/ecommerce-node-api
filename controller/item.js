const mysqlPool = require("../config/db");

exports.getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }

    const [rows] = await mysqlPool.query(
      `SELECT 
         item_id,
         item_name,
         price,
         discount_percent,
         ROUND(
           price - (price * discount_percent / 100),
           2
         ) AS discounted_price,
         category_id
       FROM items
       WHERE category_id = ?
         AND is_active = 1`,
      [categoryId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
