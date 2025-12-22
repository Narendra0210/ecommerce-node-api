// const pool = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.login = async (req, res) => {
//   try {
//     const { full_name, email, password, mobile } = req.body;

//     // 1️⃣ Validate required fields
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required"
//       });
//     }

//     if (user.email_verified !== 1) {
//   return res.status(403).json({
//     success: false,
//     message: "Please verify your email before logging in"
//   });
// }

//     // 2️⃣ Check if user exists
//    const [rows] = await pool.query(
//   "SELECT user_id, full_name, email, password_hash, role, is_active, branch_db FROM users WHERE email = ?",
//   [email]
// );

//     let user;

//     // =============================
//     // 🔹 USER EXISTS → LOGIN
//     // =============================
//     if (rows.length > 0) {
//       user = rows[0];

//       if (user.is_active !== 1) {
//         return res.status(403).json({
//           success: false,
//           message: "User account is inactive"
//         });
//       }

//       const isPasswordValid = await bcrypt.compare(
//         password,
//         user.password_hash
//       );

//       if (!isPasswordValid) {
//         return res.status(401).json({
//           success: false,
//           message: "Invalid email or password"
//         });
//       }
//     }

//     // =============================
//     // 🔹 USER NOT FOUND → REGISTER
//     // =============================
//     else {
//       if (!full_name || !mobile) {
//         return res.status(400).json({
//           success: false,
//           message: "Full name and mobile are required for registration"
//         });
//       }

//       const passwordHash = await bcrypt.hash(password, 10);

//       const [result] = await pool.query(
//         `INSERT INTO users 
//         (full_name, email, password_hash, mobile, role, is_active, created_at)
//         VALUES (?, ?, ?, ?, 'USER', 1, CURRENT_TIMESTAMP)`,
//         [full_name, email, passwordHash, mobile]
//       );

//       user = {
//         user_id: result.insertId,
//         full_name,
//         email,
//         role: "USER"
//       };
//     }

//     // 3️⃣ Generate JWT
//     const token = jwt.sign(
//       {
//         user_id: user.user_id,
//         email: user.email,
//         role: user.role,
//         db_name: user.branch_db   // 🔥 THIS FIXES YOUR ERROR

//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // 4️⃣ Final response
//     res.json({
//       success: true,
//       message: rows.length > 0 ? "Login successful" : "User registered & logged in",
//       token,
//       user: {
//         user_id: user.user_id,
//         full_name: user.full_name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error("Login/Register error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };



// exports.verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;

//     const [rows] = await mysqlPool.query(
//       "SELECT user_id FROM login WHERE email_verify_token = ?",
//       [token]
//     );

//     if (rows.length === 0) {
//       return res.status(400).send("Invalid or expired verification link");
//     }

//     await mysqlPool.query(
//       `UPDATE login
//        SET email_verified = 1, email_verify_token = NULL
//        WHERE email_verify_token = ?`,
//       [token]
//     );

//     res.send(`
//       <h2>Email verified successfully ✅</h2>
//       <p>You can now login to the application.</p>
//     `);

//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// };



const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const transporter = require("../config/email");
const emailApi = require("../config/email");

/* ============================
   1️⃣ REGISTER (CREATE USER)
   ============================ */
// exports.register = async (req, res) => {
//   try {
//     const { full_name, email, password, mobile } = req.body;

//     if (!full_name || !email || !password || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required"
//       });
//     }

//     // check existing user
//     const [existing] = await pool.query(
//       "SELECT user_id FROM users WHERE email = ?",
//       [email]
//     );

//     if (existing.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered"
//       });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     const verifyToken = crypto.randomBytes(32).toString("hex");

//     await pool.query(
//       `INSERT INTO users
//        (full_name, email, password_hash, mobile, role, is_active, email_verified, email_verify_token, created_at)
//        VALUES (?, ?, ?, ?, 'USER', 1, 0, ?, CURRENT_TIMESTAMP)`,
//       [full_name, email, passwordHash, mobile, verifyToken]
//     );
// console.log(`${process.env.BASE_URL}/api/auth/verify-email/${verifyToken}`);

//     const verifyLink = `${process.env.BASE_URL}/api/auth/verify-email/${verifyToken}`;

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Verify your email",
//       html: `
//         <h3>Hello ${full_name}</h3>
//         <p>Please verify your email by clicking below:</p>
//         <a href="${verifyLink}">Verify Email</a>
//       `
//     });

//     res.json({
//       success: true,
//       message: "Registration successful. Verification email sent."
//     });

//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };


//bravo
// exports.register = async (req, res) => {
//   try {
//     const { full_name, email, password, mobile } = req.body;

//     if (!full_name || !email || !password || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required"
//       });
//     }

//     // check existing user
//     const [existing] = await pool.query(
//       "SELECT user_id FROM users WHERE email = ?",
//       [email]
//     );

//     if (existing.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered"
//       });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     const verifyToken = crypto.randomBytes(32).toString("hex");

//     await pool.query(
//       `INSERT INTO users
//        (full_name, email, password_hash, mobile, role, is_active, email_verified, email_verify_token, created_at)
//        VALUES (?, ?, ?, ?, 'USER', 1, 0, ?, CURRENT_TIMESTAMP)`,
//       [full_name, email, passwordHash, mobile, verifyToken]
//     );

//     const verifyLink = `${process.env.BASE_URL}/api/auth/verify-email/${verifyToken}`;

//     // ✅ SEND EMAIL USING BREVO
//     await emailApi.sendTransacEmail({
//       sender: { email: "no-reply@yourapp.com", name: "Ecommerce App" },
//       to: [{ email }],
//       subject: "Verify your email",
//       htmlContent: `
//         <h3>Hello ${full_name}</h3>
//         <p>Please verify your email by clicking below:</p>
//         <a href="${verifyLink}">Verify Email</a>
//       `
//     });

//     res.json({
//       success: true,
//       message: "Registration successful. Verification email sent."
//     });

//   } catch (error) {
//     console.error("REGISTER ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


const { sendVerificationEmail } = require("../config/email");

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, mobile } = req.body;

    if (!full_name || !email || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 🔎 Check existing user
    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // 🔐 Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 🔑 Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // 💾 Save user
    await pool.query(
      `INSERT INTO users
       (full_name, email, password_hash, mobile, role, is_active, email_verified, email_verify_token, created_at)
       VALUES (?, ?, ?, ?, 'USER', 1, 0, ?, CURRENT_TIMESTAMP)`,
      [full_name, email, passwordHash, mobile, verifyToken]
    );

    // 🔗 Verification link (using query param for Render compatibility)
    // const verifyLink = `${process.env.BASE_URL}/api/verification/verify-email?token=${verifyToken}`;
    const verifyLink = `https://ecommerce-node-api-1-8ug3.onrender.com/api/verification/verify-email?token=${verifyToken}`;

    // 📧 Send email via Resend
    await sendVerificationEmail({
      to: email,
      name: full_name,
      verifyLink
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Verification email sent."
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



/* ============================
   2️⃣ LOGIN
   ============================ */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const [rows] = await pool.query(
      `SELECT user_id, full_name, email, password_hash, role, is_active, email_verified, branch_db
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = rows[0];

    if (user.is_active !== 1) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive"
      });
    }

    if (user.email_verified !== 1) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
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

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
