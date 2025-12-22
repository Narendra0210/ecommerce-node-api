const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/item", authMiddleware, cartController.addCartItem);
router.get("/:user_id", authMiddleware, cartController.getCartItems);

module.exports = router;
