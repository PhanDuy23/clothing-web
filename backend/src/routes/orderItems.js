const express = require("express");
const orderItems = express.Router();
const cors = require("cors");
const db = require("../models/mysql.js");

orderItems.use(cors());

orderItems.get("/:orderID", async (req, res) => {
    const { orderID } = req.params
    if (!orderID) {
        return res.status(400).json({
            success: false,
            message: "Thiếu orderID trong query."
        });
    }

    try {
        const [items] = await db.query(
            `SELECT id, productId, name, orderId, 
                  size, color, quantity, price, image
          FROM order_items 
          WHERE orderId = ?`,
            [orderID]
        );

        return res.status(200).json({
            success: true,
            items,
           
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách items:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy đơn hàng"
        });
    }
});

module.exports = orderItems