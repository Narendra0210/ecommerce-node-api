const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Verify email route - Query param version first (works on Render)
router.get("/verify-email", authController.verifyEmail);
// Path param version (may not work on Render, but kept for local/dev)
router.get("/verify-email/:token", authController.verifyEmail);

// Test routes for debugging
router.get("/test-token", (req, res) => {
  res.json({
    success: true,
    message: "Query param route works",
    token: req.query.token || "no token provided"
  });
});
router.get("/test-token/:token", (req, res) => {
  res.json({
    success: true,
    message: "Path param route works",
    token: req.params.token
  });
});

router.get("/__debug", (req, res) => {
  res.send("LOGIN ROUTER IS WORKING");
});

module.exports = router;
