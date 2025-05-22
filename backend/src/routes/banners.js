const express = require("express")
const banners = express.Router()
const cors = require("cors");
const db = require("../models/mysql.js")
banners.use(cors())


banners.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT id, slug, title, image FROM banners");
        res.json({
            status: 200,
            message: "Thành công",
            data: results
        });
    } catch (err) {
        console.error("❌ Lỗi truy vấn MySQL: banner", err);
        res.status(500).json({ 
            status: 500,
            message: "Lỗi truy vấn MySQL: banner",
            data: null
        });
    }
});

banners.post("/", async (req, res) => {
    const { slug, title, image } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!slug || !title || !image) {
        return res.status(400).json({
            status: 400,
            message: "Vui lòng cung cấp đủ slug, title và image."
        });
    }

    try {
        await db.query(
            `INSERT INTO banners (slug, title, image, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`,
            [slug, title, image]
        );

        res.status(201).json({
            status: 201,
            message: "Tạo banner thành công"
        });
    } catch (err) {
        console.error("❌ Lỗi tạo banner:", err);
        res.status(500).json({
            status: 500,
            message: "Lỗi tạo banner",
        });
    }
});
banners.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(`DELETE FROM banners WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Không tìm thấy banner để xóa"
            });
        }

        res.json({
            status: 200,
            message: "Xóa banner thành công"
        });
    } catch (err) {
        console.error("❌ Lỗi xóa banner:", err);
        res.status(500).json({
            status: 500,
            message: "Lỗi xóa banner"
        });
    }
});


module.exports = banners