const express = require("express")
const router   = express.Router();

const subCategoryController = require("../controller/subCategory");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/:categoryId",authMiddleware, subCategoryController.getSubCategoriesByCategory);

module.exports = router;



