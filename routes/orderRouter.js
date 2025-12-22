const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");
const authMiddleware = require("../middleware/authMiddleware");

// Place order for a user
router.post("/:user_id", authMiddleware, orderController.placeOrder);

// Get all orders for a user
router.get("/user/:user_id", authMiddleware, orderController.getUserOrders);

// Get order details by order_id
router.get("/:order_id", authMiddleware, orderController.getOrderDetails);

module.exports = router;

