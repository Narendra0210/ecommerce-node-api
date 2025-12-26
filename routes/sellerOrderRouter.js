const express = require("express");
const router = express.Router();
const sellerOrderController = require("../controller/sellerOrderController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all paid orders (for seller)
router.get("/paid", authMiddleware, sellerOrderController.getAllPaidOrders);

// Get paid order details with items (for seller)
router.get("/paid/:order_id", authMiddleware, sellerOrderController.getPaidOrderDetails);

// Update ordered status (by seller)
router.put("/:order_id/ordered-status", authMiddleware, sellerOrderController.updateOrderedStatus);

module.exports = router;



