const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../config/email");

/**
 * Register a new user
 */
const register = async (userData) => {
  const { full_name, email, password, mobile } = userData;

  // Check existing user
  const [existing] = await pool.query(
    "SELECT user_id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw { status: 409, message: "Email already registered" };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Generate verification token
  const verifyToken = crypto.randomBytes(32).toString("hex");

  // Save user
  await pool.query(
    `INSERT INTO users
     (full_name, email, password_hash, mobile, role, is_active, email_verified, email_verify_token, created_at)
     VALUES (?, ?, ?, ?, 'USER', 1, 0, ?, CURRENT_TIMESTAMP)`,
    [full_name, email, passwordHash, mobile, verifyToken]
  );

  // Verification link
  const verifyLink = `https://ecommerce-node-api-1-8ug3.onrender.com/api/verification/verify-email/${verifyToken}`;

  // Send email via Resend
  await sendVerificationEmail({
    to: email,
    name: full_name,
    verifyLink
  });

  return {
    message: "Registration successful. Verification email sent."
  };
};

/**
 * Login user
 */
const login = async (email, password) => {
  const [rows] = await pool.query(
    `SELECT user_id, full_name, email, password_hash, role, is_active, email_verified, branch_db
     FROM users
     WHERE email = ?`,
    [email]
  );

  if (rows.length === 0) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const user = rows[0];

  if (user.is_active !== 1) {
    throw { status: 403, message: "User account is inactive" };
  }

  if (user.email_verified !== 1) {
    throw { status: 403, message: "Please verify your email before login" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      db_name: user.branch_db
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token,
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }
  };
};

/**
 * Logout user (client-side token removal)
 */
const logout = async () => {
  // With JWT, logout is typically handled client-side by removing the token
  // This provides a confirmation response
  return {
    message: "Logout successful"
  };
};

module.exports = {
  register,
  login,
  logout
};

