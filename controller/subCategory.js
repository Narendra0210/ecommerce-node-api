const subCategoryService = require("../services/subCategoryService");

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

    const data = await subCategoryService.getSubCategoriesByCategory(categoryId);

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("SubCategory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};