const express = require("express");
const orders = express.Router();
const cors = require("cors");
const db = require("../models/mysql.js");

orders.use(cors());

// POST endpoint để tạo đơn hàng mới
orders.post("/", async (req, res) => {
  // Kiểm tra dữ liệu đầu vào
  if (!req.body || !req.body.order || !req.body.items) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ. Cần có order và items."
    });
  }

  // Get order and items from request body
  const { order, items } = req.body;

  try {
    // Bắt đầu transaction
    await db.beginTransaction();

    try {
      // Kiểm tra từng sản phẩm
      for (const item of items) {
        console.log(`Kiểm tra sản phẩm: ID=${item.productId}, Size=${item.size}, Color=${item.color}`);

        // Query để kiểm tra sản phẩm
        const [productResults] = await db.query(
          "SELECT id, quantity FROM product_attributes WHERE productId = ? AND size = ? AND color = ?",
          [item.productId, item.size, item.color]
        );

        console.log("Kết quả truy vấn sản phẩm:", productResults);

        // Nếu không tìm thấy sản phẩm
        if (productResults.length === 0) {
          throw new Error(`Không tìm thấy sản phẩm với ID ${item.productId}, size ${item.size}, color ${item.color}`);
        }

        const product = productResults[0];

        if (product.quantity < item.quantity) {
          throw new Error(`Số lượng không đủ cho sản phẩm  ${item.name}, size ${item.size}, color ${item.color}. Hiện có: ${product.quantity}, Yêu cầu: ${item.quantity}`);
        }
      }

      // Cập nhật số lượng sản phẩm
      for (const item of items) {
        console.log(`Cập nhật số lượng sản phẩm: ID=${item.productId}, Size=${item.size}, Color=${item.color}`);

        // Cập nhật số lượng sản phẩm
        await db.query(
          "UPDATE product_attributes SET quantity = quantity - ?, updated_at = NOW() WHERE productId = ? AND size = ? AND color = ?",
          [item.quantity, item.productId, item.size, item.color]
        );
      }

      // Tạo đơn hàng
      console.log("Tạo đơn hàng mới");

      // Thêm đơn hàng vào database
      const [orderResult] = await db.query(
        `INSERT INTO orders (
          userId, address, province, district, ward, note, 
          paymentMethod, paymentStatus, shippingFee, 
          discount, total, status, created_at, updated_at
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          order.userId,
          order.address,
          order.provinceName,
          order.districtName,
          order.wardName,
          order.note || null,
          order.paymentMethod,
          order.paymentStatus,
          order.shippingFee,
          order.discount,
          order.total,
          order.status
        ]
      );
      
      const [orderRows] = await db.query(
        `SELECT id FROM orders 
          WHERE userId = ? 
          ORDER BY created_at DESC 
           LIMIT 1`,
        [order.userId]
      );
      const orderId = orderRows[0]?.id;

      console.log(`Đơn hàng đã được tạo với ID: ${orderId}`);

      // Thêm chi tiết đơn hàng
      for (const item of items) {
        console.log(`Thêm sản phẩm vào đơn hàng: ${item.name}`);

        // Thêm chi tiết đơn hàng
        await db.query(
          `INSERT INTO order_items (
            orderId, productId, name, 
            size, color, quantity, price, image, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?,?, NOW(), NOW())`,
          [
            orderId,
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
      // 
      // Commit transaction
      await db.commit();
      console.log("Transaction đã được commit thành công");

      return res.status(201).json({
        success: true,
        message: "Đơn hàng đã được tạo thành công",
        orderId
      });

    } catch (error) {
      // Rollback transaction khi có lỗi
      console.error("Lỗi xử lý đơn hàng:", error);
      await db.rollback();

      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  } catch (error) {
    console.error("Lỗi transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xử lý đơn hàng"
    });
  }
});

orders.get("/", async (req, res) => {
  const { status } = req.query;
  console.log(req.query);
  
  const limit = parseInt(req.query.limit) || parseInt(process.env.QRY_LIMIT) || 10;
  const page = parseInt(req.query.page) || parseInt(process.env.QRY_PAGE) || 1;
  const offset = (page - 1) * limit;

  try {
    // 1. Lấy danh sách đơn hàng
    let query = `SELECT id, userId, address, province, district, ward, note, 
                        paymentMethod, paymentStatus,  total,  created_at 
                  FROM orders 
                  WHERE status =  ?`;
    const params = [status];

    query += ` ORDER BY created_at ASC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [ordersList] = await db.query(query, params);
 

    // 3. Đếm tổng số đơn hàng
    let countQuery = `SELECT COUNT(*) AS total FROM orders WHERE status = ?`;
    const countParams = [status];
    const [[{ total }]] = await db.query(countQuery, countParams);

    return res.status(200).json({
      success: true,
      orders: ordersList,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng"
    });
  }
});

// GET /orders/count-this-month
orders.get("/count-this-month", async (req, res) => {
  try {
      const [[result]] = await db.query(`
          SELECT COUNT(*) AS totalOrdersThisMonth
          FROM orders
          WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
      `);
      res.json({ totalOrder: result.totalOrdersThisMonth });
  } catch (error) {
      console.error("❌ Lỗi khi đếm đơn hàng tháng này:", error);
      res.status(500).json({ error: "Lỗi server" });
  }
});

orders.get("/:userId", async (req, res) => {
  const { status } = req.query;
  const {userId} = req.params
  
  const limit = parseInt(req.query.limit) || parseInt(process.env.QRY_LIMIT) || 10;
  const page = parseInt(req.query.page) || parseInt(process.env.QRY_PAGE) || 1;
  const offset = (page - 1) * limit;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu userId trong query."
    });
  }

  try {
    // 1. Lấy danh sách đơn hàng
    let query = `SELECT id, userId, address, province, district, ward, note, 
                        paymentMethod,  total,  created_at 
                  FROM orders 
                  WHERE userId = ?`;
    const params = [userId];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [ordersList] = await db.query(query, params);

    // 2. Lấy orderItems cho mỗi order
    for (const order of ordersList) {
      const [items] = await db.query(
        `SELECT id, productId, name, 
                size, color, quantity, price, image
        FROM order_items 
        WHERE orderId = ?`,
        [order.id]
      );
      order.items = items;

    }

    // 3. Đếm tổng số đơn hàng
    let countQuery = `SELECT COUNT(*) AS total FROM orders WHERE userId = ?`;
    const countParams = [userId];
    if (status) {
      countQuery += ` AND status = ?`;
      countParams.push(status);
    }

    const [[{ total }]] = await db.query(countQuery, countParams);

    return res.status(200).json({
      success: true,
      orders: ordersList,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng"
    });
  }
});


orders.put("/:id", async (req, res) => {
  const orderId = req.params.id;
  const { status, paymentStatus } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Trạng thái đơn hàng là bắt buộc."
    });
  }

  try {
    let query = ""
    const params = []
    if(status){
      query += "status = ?,"
      params.push(status)
    }
    if(paymentStatus){
      query += "paymentStatus = ?,"
      params.push(paymentStatus)
    }
    params.push(orderId)
    const [result] = await db.query(
      `UPDATE orders SET ${query} updated_at = NOW() WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để cập nhật."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công"
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái đơn hàng"
    });
  }
});





module.exports = orders;