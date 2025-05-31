const express = require("express")
const search = express.Router()
const cors = require("cors");
const db = require("../models/mysql.js")
search.use(cors())

search.get("/", async (req, res) => {
    try {
        const { query } = req.query;
        const limit = parseInt(req.query.limit) || parseInt(process.env.QRY_LIMIT) || 10; // Mặc định 10 sản phẩm/trang
        const page = parseInt(req.query.page) || parseInt(process.env.QRY_PAGE) || 1; // Mặc định trang 1   
        const offset = (page - 1) * limit;
        if (!query) {
            return res.status(400).json({
                status: 400,
                message: "Vui lòng cung cấp từ khóa tìm kiếm (query)",
          
            });
        }
        
        // Tách từ khóa tìm kiếm thành các từ riêng biệt
        const searchTerms = query
            .toLowerCase()
            .split(" ")
            .filter(term => term.trim() !== "");
            
        if (searchTerms.length === 0) {
            return res.json({
                status: 200,
                message: "Thành công",
                data: []
            });
        }
        
        // Tạo điều kiện tìm kiếm cho mỗi từ
        let sql = "SELECT id, slug, name, price, shortDescription, thumbnail FROM products WHERE";
        let sqlCount = "select count(*) as total FROM products WHERE "
        let conditions = [];
        let params = [];
        
        // Tạo điều kiện cho mỗi từ khóa tìm kiếm
        searchTerms.forEach(term => {
            // Thêm điều kiện tìm kiếm cho mỗi từ (tìm trong cả slug và title)
            conditions.push("(slug LIKE ? OR name LIKE ?)");
            params.push(`%${term}%`, `%${term}%`);
        });
        
        // Kết hợp các điều kiện với AND để đảm bảo tất cả các từ đều có mặt
        sql += conditions.join(" AND ");
        sqlCount += conditions.join(" AND ");
        
        const [[{ total }]] = await db.query(sqlCount , params);

        sql += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [results] = await db.query(sql, params);
        
        
        res.json({
            status: 200,
            success: true,
            message: "Thành công",
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
            data: results,
        });
    } catch (err) {
        console.error("❌ Lỗi tìm kiếm banner:", err);
        res.status(500).json({ 
            status: 500,
            message: "Lỗi tìm kiếm banner",
            data: null
        });
    }
});

module.exports = search