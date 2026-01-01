const wishlistService = require("../services/wishlistService");

// ➕ Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and product_id are required"
      });
    }

    const result = await wishlistService.addToWishlist(user_id, product_id);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// 📦 Get Wishlist Items
exports.getWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    const items = await wishlistService.getWishlist(user_id);

    res.json({
      success: true,
      data: items
    });

  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ❌ Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and product_id are required"
      });
    }

    const result = await wishlistService.removeFromWishlist(user_id, product_id);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error("Remove wishlist error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message
    });
  }
};
