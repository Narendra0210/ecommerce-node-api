const pool = require("../config/db");

/**
 * Verify email with token
 */
const verifyEmail = async (token) => {
  const [rows] = await pool.query(
    "SELECT user_id FROM users WHERE email_verify_token = ?",
    [token]
  );

  if (rows.length === 0) {
    throw { status: 400, message: "Invalid or expired verification link" };
  }

  await pool.query(
    `UPDATE users
     SET email_verified = 1, email_verify_token = NULL
     WHERE email_verify_token = ?`,
    [token]
  );

  return {
    message: "Email verified successfully ✅",
    html: `
      <h2>Email verified successfully ✅</h2>
      <p>You can now login.</p>
    `
  };
};

module.exports = {
  verifyEmail
};

