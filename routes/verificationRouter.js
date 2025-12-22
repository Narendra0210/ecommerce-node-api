const express = require("express");
const router = express.Router();
const verificationController = require("../controller/verification");

// Verify email route - Query param version (works on Render)
router.get("/verify-email", verificationController.verifyEmail);
// Path param version (fallback for local/dev)
router.get("/verify-email/:token", verificationController.verifyEmail);

module.exports = router;

