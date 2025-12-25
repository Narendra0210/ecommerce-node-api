const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

router.post("/create-order", paymentController.createPaymentOrder);
router.post("/verify", paymentController.verifyPayment);

module.exports = router;
