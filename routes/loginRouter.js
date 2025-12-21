const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verifyemail/:token", authController.verifyEmail);

module.exports = router;
