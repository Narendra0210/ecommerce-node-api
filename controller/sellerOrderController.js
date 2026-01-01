const sellerOrderService = require("../services/sellerOrderService");

/* ============================
   GET PAID ORDER DETAILS WITH ITEMS (For Seller)
   ============================ */
exports.getPaidOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    const data = await sellerOrderService.getPaidOrderDetails(order_id);

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("Get paid order details error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message
    });
  }
};

/* ============================
   GET ALL PAID ORDERS (For Seller)
   ============================ */
exports.getAllPaidOrders = async (req, res) => {
  try {
    const result = await sellerOrderService.getAllPaidOrders();

    res.json({
      success: true,
      data: result.orders,
      count: result.count
    });

  } catch (error) {
    console.error("Get all paid orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ============================
   UPDATE ORDERED STATUS (By Seller)
   ============================ */
exports.updateOrderedStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { ordered_status } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    if (!ordered_status) {
      return res.status(400).json({
        success: false,
        message: "ordered_status is required"
      });
    }

    const data = await sellerOrderService.updateOrderedStatus(order_id, ordered_status);

    res.json({
      success: true,
      message: "Ordered status updated successfully",
      data: data
    });

  } catch (error) {
    console.error("Update ordered status error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error";
    res.status(status).json({
      success: false,
      message: message
    });
  }
};

