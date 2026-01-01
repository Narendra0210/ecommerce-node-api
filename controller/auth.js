const authService = require("../services/authService");

/* ============================
  1️⃣ REGISTER (CREATE USER)
  ============================ */
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, mobile } = req.body;

    if (!full_name || !email || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const result = await authService.register({ full_name, email, password, mobile });

    res.status(201).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({
      success: false,
      message: message
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

    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: result.message,
      token: result.token,
      user: result.user
    });

  } catch (error) {
    console.error("Login error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message
    });
  }
};

/* ============================
  3️⃣ LOGOUT
  ============================ */
exports.logout = async (req, res) => {
  try {
    const result = await authService.logout();
    
    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
