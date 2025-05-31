const express = require("express");
const users = express.Router();
const cors = require("cors");
const db = require("../models/mysql.js");
const jwt = require('jsonwebtoken');
const {checkRole, authenticateToken} = require("./auth.js")
const bcrypt = require("bcrypt"); // Để mã hóa mật khẩu


users.use(cors());

// Đăng ký người dùng mới
users.post("/register",  async (req, res) => {
    try {
        const { fullName, userName, email, password, address, phone, avatar, role } = req.body;

        // Kiểm tra xem email hoặc username đã tồn tại chưa
        const [existingUsers] = await db.query(
            "SELECT * FROM users WHERE email = ? OR userName = ?",
            [email, userName]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                error: "Email hoặc tên đăng nhập đã tồn tại"
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm người dùng mới vào cơ sở dữ liệu
        const [result] = await db.query(
            `INSERT INTO users (fullName, userName, email, password, address, phone, role, avatar, status, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [fullName, userName, email, hashedPassword, address || null, phone || null, role ||"customer", avatar || null, 1]
        );

        if (result.affectedRows) {
            // Truy vấn thông tin người dùng vừa tạo (không bao gồm mật khẩu)
            const [[user]] = await db.query(
                "SELECT id, fullName, userName, email, address, phone, role, avatar, status, created_at FROM users WHERE id = ?",
                [result.insertId]
            );

            res.status(201).json({
                message: "Đăng ký thành công",
                user
            });
        } else {
            res.status(500).json({ error: "Không thể tạo người dùng" });
        }
    } catch (error) {
        console.error("❌ Lỗi đăng ký:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Đăng nhập
users.post("/login", async (req, res) => {
    try {
        const { userName, password } = req.body;

        // Tìm người dùng theo userName
        const [[user]] = await db.query(
            "SELECT * FROM users WHERE userName = ?",
            [userName]
        );

        if (!user) {
            return res.status(401).json({ error: "Tên tài khoản hoặc mật khẩu không đúng" });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Tên tài khoản hoặc mật khẩu không đúng" });
        }
        const accessToken = jwt.sign(user, process.env.JWT_SECRET);
        // Loại bỏ mật khẩu trước khi gửi phản hồi
        const { password: _, ...userWithoutPassword } = user;
        console.log("token",accessToken);
        
        res.json({
            status: 200,
            message: "Đăng nhập thành công",
            user: userWithoutPassword,
            token: accessToken 
        });
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error);
        res.status(500).json({ status: 500, error: "Lỗi server" });
    }
});

// Cập nhật thông tin người dùng
users.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, email, status } = req.body;
        console.log(id);
        if(req.user.id != id && req.user.role == "customer"){
            return res.status(403).json({ error: "Người dùng không đủ quyền chỉnh sửa" });
        }

        // Kiểm tra người dùng tồn tại
        const [[existingUser]] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (!existingUser) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        // Cập nhật thông tin người dùng
        const [result] = await db.query(
            `UPDATE users 
             SET fullName = ?,  phone = ?, email = ?, status = ?, updated_at = NOW() 
             WHERE id = ?`,
            [
                fullName || existingUser.fullName,
                phone !== undefined ? phone : existingUser.phone,
                email !== undefined ? email : existingUser.email,
                status !== undefined ? status : existingUser.status,
                id
            ]
        );

        if (result.affectedRows) {
            // Lấy thông tin người dùng sau khi cập nhật
            const [[updatedUser]] = await db.query(
                `SELECT id, fullName, userName, email, address, phone, role, avatar
                 FROM users WHERE id = ?`,
                [id]
            );

            res.status(201).json({
                message: "Cập nhật thành công",
                user: updatedUser
            });
        } else {
            res.status(500).json({ error: "Không thể cập nhật thông tin người dùng" });
        }
    } catch (error) {
        console.error("❌ Lỗi cập nhật:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Đổi mật khẩu
users.put("/change-password/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Kiểm tra người dùng tồn tại
        const [[user]] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        // Kiểm tra mật khẩu hiện tại
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Mật khẩu hiện tại không đúng" });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu
        const [result] = await db.query(
            "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
            [hashedPassword, id]
        );

        if (result.affectedRows) {
            res.json({ message: "Đổi mật khẩu thành công" });
        } else {
            res.status(500).json({ error: "Không thể đổi mật khẩu" });
        }
    } catch (error) {
        console.error("❌ Lỗi đổi mật khẩu:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Lấy danh sách người dùng (có phân trang)
users.get("/",  async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || parseInt(process.env.QRY_LIMIT) || 10;
        const page = parseInt(req.query.page) || parseInt(process.env.QRY_PAGE) || 1;
        const offset = (page - 1) * limit;
        const {status, role} = req.query
 
        // Lấy danh sách người dùng
        const [users] = await db.query(
            `SELECT id, fullName, phone, role, status, address, created_at 
             FROM users 
             where status = ? and role = ?
             LIMIT ? OFFSET ?`,
            [status, role, limit, offset ] 
        );

        // Lấy tổng số người dùng 
        const [[{ total }]] = await db.query(
            "SELECT COUNT(*) AS total FROM users where status = ? and role = ?",  [status, role] 
        );

        res.json({
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
            users
        });
    } catch (error) {
        console.error("❌ Lỗi truy vấn MySQL:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Xóa người dùng
users.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra người dùng tồn tại
        const [[user]] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        // Xóa người dùng
        const [result] = await db.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );

        if (result.affectedRows) {
            res.json({ message: "Xóa người dùng thành công" });
        } else {
            res.status(500).json({ error: "Không thể xóa người dùng" });
        }
    } catch (error) {
        console.error("❌ Lỗi xóa người dùng:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Lấy tổng số lượng user
users.get("/count", async (req, res) => {
    try {
        const {role} = req.query
        console.log(role);
        
        const [[result]] = await db.query(
            `SELECT COUNT(*) AS total FROM users WHERE role = ? AND status = 1`,
            [role]
        );

        res.json({ totalUser: result.total });
    } catch (error) {
        console.error("❌ Lỗi truy vấn MySQL:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Lấy thông tin người dùng theo ID
users.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [[user]] = await db.query(
            `SELECT id, fullName, userName, email, address, phone, role, avatar
             FROM users WHERE id = ? and status = 1`,
            [id]
        );

        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Lỗi truy vấn MySQL:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

module.exports = users;