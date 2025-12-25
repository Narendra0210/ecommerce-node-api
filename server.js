const express = require("express");
const cors = require("cors");
const mysqlPool = require("./config/db");

// Load .env only locally
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const loginRouter = require("./routes/loginRouter");
const verificationRouter = require("./routes/verificationRouter");
const categoryRouter = require("./routes/categoryRouter");
const subCategoryRouter = require("./routes/subCategoryRouter");
const itemRouter = require("./routes/itemRouter");
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");
const wishlistRouter = require("./routes/wishlistRouter");
// const paymentRouter = require("./routes/paymentRouter");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", loginRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/menu", categoryRouter);
app.use("/api/subcategories", subCategoryRouter);
app.use("/api/items", itemRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/wishlist", wishlistRouter);
// app.use("/api/payment", paymentRouter);
app.get("/", (req, res) => {
  res.send("API ROOT WORKING");
});
// Test route
app.get("/test", (req, res) => {
  res.status(200).send("<h1>nodejs mysql welcome</h1>");
});
console.log("DB_NAME from env:", process.env.DB_NAME);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Test DB connection (DO NOT EXIT APP)
mysqlPool.query("SELECT 1")
  .then(() => console.log("mysql db connected"))
  .catch(err => console.error("db connection failed:", err.message));

// Email test
const transporter = require("./config/email");

app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Email setup is working 🎉"
    });

    res.send("Email sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Email failed");
  }
});
