const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const itemController = require("../controller/item");
// Get items by category id
router.get("/:categoryId", authMiddleware,itemController.getItemsByCategory);

module.exports = router;
