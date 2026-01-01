const categoryService = require("../services/categoryService");

exports.getCategoriesAndItems = async (req, res) => {
  try {
    const result = await categoryService.getCategoriesAndItems();

    res.json({
      success: true,
      categories: result.categories,
      items: result.items
    });

  } catch (error) {
    console.error("Category & Items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

