const cartService = require("../services/cartService");

/* ============================
   ADD / UPDATE CART ITEM
   ============================ */
exports.addCartItem = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { product_id, quantity, price } = req.body;

    if (!product_id || quantity === undefined || !price) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const result = await cartService.addCartItem(user_id, product_id, quantity, price);

    res.json({
      success: true,
      message: result.message
    });

  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   GET CART ITEMS FOR USER
   ============================ */
exports.getCartItems = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id parameter is required"
      });
    }

    const items = await cartService.getCartItems(user_id);

    res.json({
      success: true,
      data: items
    });

  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
