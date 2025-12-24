// const mysqlPool = require("../config/db");

// exports.getCategoriesAndItems = async (req, res) => {
//   try {
//     // 🔹 Read db name from token
//     const { db_name } = req.user;

//     if (!db_name) {
//       return res.status(400).json({
//         success: false,
//         message: "Database info missing in token"
//       });
//     }

//     // 🔹 Create DB connection dynamically
//     const dbPool = await mysqlPool(db_name);

//     // 🔹 Fetch categories
//     const [categories] = await dbPool.query(
//       "SELECT category_id, category_name FROM categories WHERE is_active = 1"
//     );

//     // 🔹 Fetch items
//     const [items] = await dbPool.query(
//       `SELECT item_id, item_name, price, category_id 
//        FROM items 
//        WHERE is_active = 1`
//     );

//     res.json({
//       success: true,
//       categories,
//       items
//     });

//   } catch (error) {
//     console.error("Category & Items error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };



const mysqlPool = require("../config/db");

exports.getCategoriesAndItems = async (req, res) => {
  try {
    // ❌ REMOVE db_name logic completely
    // const { db_name } = req.user;

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
       WHERE category_id = ?
         AND is_active = 1`
    );

    res.json({
      success: true,
      categories,
      items
    });

  } catch (error) {
    console.error("Category & Items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

