const express = require("express")
const categories = express.Router()
const cors = require("cors");
const db = require("../models/mysql.js")
const cld = require("../models/cloudinary.js")
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const uploadToCloudinary = require("./products.js"); // hàm upload đã 
require("dotenv").config();
const { checkRole, authenticateToken } = require("./auth.js")
categories.use(cors())

categories.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || parseInt(process.env.QRY_LIMIT) || 20; // Mặc định là 10
    const page = parseInt(req.query.page) || parseInt(process.env.QRY_PAGE) || 1; // Mặc định là trang 1
    const offset = (page - 1) * limit;
    const { status, parentId } = req.query

    // Lấy danh sách categories với phân trang
    let par = ""
    if (parentId == "0") {
      par = "AND (parentId IS NULL OR parentId = 0)"
    } else if (parentId == "1"){
      par = "and parentId >= 1"
    }
    const [categories] = await db.query(
      `SELECT id, slug, name, parentId, description, image 
  FROM categories 
  WHERE status = ? 
    ${par}
  LIMIT ? OFFSET ?`,
      [status || 1, limit, offset]
    );

    // Lấy tổng số categories để tính tổng số trang
    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM categories where status = ? ${par}`, [status || 1]);

    if (categories.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy danh mục nào" });
    }

    res.status(200).json({
      pagination: {
        totalItems: total, // Tổng số bản ghi
        totalPages: Math.ceil(total / limit), // Tổng số trang
        currentPage: page,
      },
      categories
    });

  } catch (err) {
    console.error("❌ Lỗi truy vấn MySQL: categories", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

categories.post("/", authenticateToken, checkRole("admin"), async (req, res) => {
  const {
    name,
    slug,
    description,
    parentId,
    status,
    image
  } = req.body;
  const imageUrl = image
  // Kiểm tra các trường bắt buộc
  if (!name || !slug) {
    return res.status(400).json({
      success: false,
      message: "Thiếu trường bắt buộc: name, slug",
    });
  }

  try {

    const [result] = await db.query(
      `INSERT INTO categories(
        name, slug, description, parentId, status, image, created_at, updated_at
      ) VALUES(?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name,
        slug,
        description || null,
        parentId || null,
        status || 1,
        imageUrl || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      categoryId: result.insertId,
    });

  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo danh mục",
    });
  }
});

categories.put("/:id", authenticateToken, checkRole("admin"), async (req, res) => {
  const categoryId = req.params.id;
  const {
    name,
    slug,
    description,
    parentId,
    status,
    imageUrl,
  } = req.body;

  // Tạo mảng lưu các trường cần cập nhật và giá trị tương ứng
  const fieldsToUpdate = [];
  const values = [];

  if (name !== undefined && name !== null) {
    fieldsToUpdate.push("name = ?");
    values.push(name);
  }
  if (slug !== undefined && slug !== null) {
    fieldsToUpdate.push("slug = ?");
    values.push(slug);
  }
  if (description !== undefined && description !== null) {
    fieldsToUpdate.push("description = ?");
    values.push(description);
  }
  if (parentId !== undefined && parentId !== null) {
    fieldsToUpdate.push("parentId = ?");
    values.push(parentId);
  }
  if (status !== undefined && status !== null) {
    fieldsToUpdate.push("status = ?");
    values.push(status);
  }
  if (imageUrl !== undefined && imageUrl !== null) {
    fieldsToUpdate.push("image = ?");
    values.push(imageUrl);
  }

  // Nếu không có trường nào để cập nhật
  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Không có dữ liệu nào để cập nhật",
    });
  }

  // Thêm updated_at
  fieldsToUpdate.push("updated_at = NOW()");

  try {
    const [result] = await db.query(
      `UPDATE categories SET ${fieldsToUpdate.join(", ")} WHERE id = ? `,
      [...values, categoryId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục cần cập nhật",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật danh mục",
    });
  }
});

module.exports = categories