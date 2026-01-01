const mysqlPool = require("../config/db");

/**
 * Get all categories and items
 */
const getCategoriesAndItems = async () => {
  const [categories] = await mysqlPool.query(
    "SELECT category_id, category_name FROM categories WHERE is_active = 1"
  );

  const [items] = await mysqlPool.query(
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
     WHERE is_active = 1`
  );

  return {
    categories,
    items
  };
};

module.exports = {
  getCategoriesAndItems
};

