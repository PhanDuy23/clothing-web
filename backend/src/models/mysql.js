const mysql = require("mysql2");
require("dotenv").config();

// Kết nối MySQL với promise
const db = mysql.createConnection({ 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).promise();

// Kiểm tra kết nối khi khởi động
db.query("SELECT 1")
  .then(() => {
    console.log("✅ Kết nối MySQL thành công!");
  })
  .catch(err => {
    console.error("❌ Kết nối MySQL thất bại:", err);
  });

module.exports = db;