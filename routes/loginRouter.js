const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);

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
