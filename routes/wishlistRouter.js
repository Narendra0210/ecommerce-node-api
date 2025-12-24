const express = require("express");
const router = express.Router();
const wishlistController = require("../controller/wishlistController");

// Add to wishlist
router.post("/add", wishlistController.addToWishlist);

// Get wishlist
router.get("/:user_id", wishlistController.getWishlist);

router.delete("/remove", wishlistController.removeFromWishlist);


module.exports = router;
