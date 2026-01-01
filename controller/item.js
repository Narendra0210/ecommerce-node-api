const itemService = require("../services/itemService");

exports.getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }

    const data = await itemService.getItemsByCategory(categoryId);

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
