const express = require("express");
require("dotenv").config();
const cors = require("cors"); 
const app = express();
app.use(express.json())

// Cấu hình CORS cho cả môi trường development và production
const allowedOrigins = [
  "http://localhost:5173",  // Development frontend
  process.env.FRONTEND_URL, // Production frontend URL (thêm vào Railway)
  "https://clothing-web-production.up.railway.app" // Thay thế bằng domain thực tế của frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // Cho phép requests không có origin (như mobile apps hoặc curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const categories = require("./routes/categories")
const products = require("./routes/products")
const banners = require("./routes/banners")
const shipping = require("./routes/shipping")
// const payment = require("./routes/payment")
const orders = require("./routes/order")
const users = require("./routes/users")
const carts = require("./routes/shopping-cart")
const cld = require("./routes/cloudinary")
const orderItems = require("./routes/orderItems")
const search = require("./routes/search")

app.use("/search", search)
app.use("/orderItems", orderItems)
app.use("/cld", cld)
app.use("/carts", carts)
app.use("/users", users)
app.use("/orders", orders)
// app.use("/payment", payment)
app.use("/shipping", shipping)
app.use("/categories", categories)
app.use("/products",products)
app.use("/banners",banners)

// Thêm route mặc định để kiểm tra API
app.get("/", (req, res) => {
  res.json({ message: "API đang hoạt động!" });
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server chạy tại http://localhost:${PORT}`));