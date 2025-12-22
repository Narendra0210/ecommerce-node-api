const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/__debug", (req, res) => {
  res.send("LOGIN ROUTER IS WORKING");
});

module.exports = router;
