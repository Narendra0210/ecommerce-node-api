const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Verify email route - support both path param and query param
router.get("/verify-email", authController.verifyEmail); // Query param: ?token=xxx (works on Render)
router.get("/verify-email/:token", authController.verifyEmail); // Path param: /verify-email/xxx (fallback)

// Test route to verify parameter routing works
router.get("/test-token/:token", (req, res) => {
  res.json({
    success: true,
    message: "Token route works",
    token: req.params.token
  });
});

router.get("/__debug", (req, res) => {
  res.send("LOGIN ROUTER IS WORKING");
});

module.exports = router;
