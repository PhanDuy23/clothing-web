const express = require("express");
const carts = express.Router();
const cors = require("cors");
const db = require("../models/mysql.js");

carts.use(cors());

// 1. Thêm sản phẩm vào giỏ hàng
carts.post("/", async (req, res) => {
    
    if (!req.body || !req.body.items) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ. Cần có items."
        });
    }

    // Get items from request body
    const { items, userId } = req.body;

    try {
        // Thêm chi tiết giỏ hàng
        for (const item of items) {
            console.log(`Thêm sản phẩm vào giỏ hàng: ${item.name}`);

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const [existingItems] = await db.query(
                `SELECT * FROM carts WHERE userId = ? AND productId = ? AND size = ? AND color = ?`,
                [userId, item.productId, item.size, item.color]
            );

            if (existingItems.length > 0) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                await db.query(
                    `UPDATE carts SET quantity = quantity + ?, updated_at = NOW() 
                     WHERE userId = ? AND productId = ? AND size = ? AND color = ?`,
                    [
                        item.quantity,
                        userId,
                        item.productId,
                        item.size,
                        item.color
                    ]
                );
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới
                await db.query(
                    `INSERT INTO carts (
                        userId, productId, name, 
                        size, color, quantity, price, image, created_at, updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                    [
                        userId,
                        item.productId,
                        item.name,
                        item.size,
                        item.color,
                        item.quantity,
                        item.price, 
                        item.image
                    ]
                );
            }
        }

        return res.status(201).json({
            success: true,
            message: "Đã thêm sản phẩm vào giỏ hàng thành công",
        });

    } catch (error) {
        console.error("Lỗi xử lý giỏ hàng:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 2. Lấy danh sách sản phẩm trong giỏ hàng
carts.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Kiểm tra userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin người dùng"
            });
        }

        // Lấy danh sách sản phẩm trong giỏ hàng
        const [cartItems] = await db.query(
            `SELECT * FROM carts WHERE userId = ? ORDER BY created_at DESC`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách giỏ hàng thành công",
            data: cartItems
        });

    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy giỏ hàng"
        });
    }
});


// 4. Xóa sản phẩm khỏi giỏ hàng
carts.delete("/:cartItemId", async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId;

        // Kiểm tra cartItemId
        if (!cartItemId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin sản phẩm cần xóa"
            });
        }

        // Kiểm tra xem item có tồn tại không
        const [existingItem] = await db.query(
            `SELECT * FROM carts WHERE id = ?`,
            [cartItemId]
        );

        if (existingItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm trong giỏ hàng"
            });
        }

        // Xóa sản phẩm
        await db.query(
            `DELETE FROM carts WHERE id = ?`,
            [cartItemId]
        );

        return res.status(200).json({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ hàng thành công"
        });

    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa sản phẩm khỏi giỏ hàng"
        });
    }
});

// 5. Xóa toàn bộ giỏ hàng của người dùng
carts.delete("/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Kiểm tra userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin người dùng"
            });
        }

        // Xóa toàn bộ giỏ hàng
        await db.query(
            `DELETE FROM carts WHERE userId = ?`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            message: "Đã xóa toàn bộ giỏ hàng thành công"
        });

    } catch (error) {
        console.error("Lỗi khi xóa giỏ hàng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa giỏ hàng"
        });
    }
});

module.exports = carts;