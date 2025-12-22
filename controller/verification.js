const pool = require("../config/db");

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

    const [rows] = await pool.query(
      "SELECT user_id FROM users WHERE email_verify_token = ?",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).send("Invalid or expired verification link");
    }

    await pool.query(
      `UPDATE users
       SET email_verified = 1, email_verify_token = NULL
       WHERE email_verify_token = ?`,
      [token]
    );

    res.send(`
      <h2>Email verified successfully ✅</h2>
      <p>You can now login.</p>
    `);

  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).send("Server error");
  }
};

