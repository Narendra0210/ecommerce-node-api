const verificationService = require("../services/verificationService");

/* ============================
   VERIFY EMAIL
   ============================ */
exports.verifyEmail = async (req, res) => {
  try {
    console.log("verifyEmail called - req.params:", req.params, "req.query:", req.query);
    // Support both path parameter and query parameter
    const token = req.params.token || req.query.token;

    if (!token) {
      return res.status(400).send("Token is required");
    }

    const result = await verificationService.verifyEmail(token);

    res.send(result.html);

  } catch (error) {
    console.error("Verify email error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).send(message);
  }
};

