const mysqlPool = require("../config/db");

/**
 * Get items by category ID
 */
const getItemsByCategory = async (categoryId) => {
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

  return rows;
};

module.exports = {
  getItemsByCategory
};

