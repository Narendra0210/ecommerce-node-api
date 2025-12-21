const mysqlPool = require("../config/db");

exports.getSubCategoriesByCategory = async (req, res) => {
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
         sub_category_id,
         sub_category_name,
         category_id
       FROM sub_categories
       WHERE category_id = ? AND is_active = 1`,
      [categoryId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("SubCategory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};