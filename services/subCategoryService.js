const mysqlPool = require("../config/db");

/**
 * Get subcategories by category ID
 */
const getSubCategoriesByCategory = async (categoryId) => {
  const [rows] = await mysqlPool.query(
    `SELECT 
       sub_category_id,
       sub_category_name,
       category_id
     FROM sub_categories
     WHERE category_id = ? AND is_active = 1`,
    [categoryId]
  );

  return rows;
};

module.exports = {
  getSubCategoriesByCategory
};

