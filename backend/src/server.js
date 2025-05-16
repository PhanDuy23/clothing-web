const express = require("express");
require("dotenv").config();
const cors = require("cors"); 
const app = express();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
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
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server chạy tại http://localhost:${PORT}`));
