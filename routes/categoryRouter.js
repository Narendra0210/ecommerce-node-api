const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const categoryController = require("../controller/category");

// 🔐 Protected API
router.get(
  "/categories-items",
  authMiddleware,
  categoryController.getCategoriesAndItems
);

module.exports = router;
