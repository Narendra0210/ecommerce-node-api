const orderService = require("../services/orderService");

/* ============================
   PLACE ORDER
   ============================ */
exports.placeOrder = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    const data = await orderService.placeOrder(user_id);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: data
    });

  } catch (error) {
    console.error("Place order error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message,
      error: error.message
    });
  }
};

/* ============================
   GET USER ORDERS
   ============================ */
exports.getUserOrders = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    const orders = await orderService.getUserOrders(user_id);

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ============================
   GET ORDER DETAILS
   ============================ */
exports.getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    const data = await orderService.getOrderDetails(order_id);

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("Get order details error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message
    });
  }
};

/* ============================
   CLOSE/COMPLETE ORDER
   ============================ */
exports.closeOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    const data = await orderService.closeOrder(order_id);

    res.json({
      success: true,
      message: "Order closed successfully",
      data: data
    });

  } catch (error) {
    console.error("Close order error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message
    });
  }
};

