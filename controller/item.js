const mysqlPool = require("../config/db");

exports.getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // validation
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
