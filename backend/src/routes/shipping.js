const express = require("express")
const shipping = express.Router()
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

shipping.use(cors()) 

shipping.get("/province", async (req, res) => {
    try {
        const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
            headers: {
                "Content-Type": "application/json",
                "Token": process.env.GHN_TOKEN // Thay thế bằng token của bạn
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching provinces:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

shipping.get("/district", async (req, res) => {
    try {
        const province_id = req.query.provinceId
        
        const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
            headers: {
                "Content-Type": "application/json",
                "Token": process.env.GHN_TOKEN // Thay thế bằng token của bạn
            },
            params: { province_id }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching districts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

shipping.get("/ward", async (req, res) => {
    try {
        const district_id = req.query.districtId      
        const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
            headers: {
                "Content-Type": "application/json",
                "Token": process.env.GHN_TOKEN // Thay thế bằng token của bạn
            },
            params: { district_id }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching wards:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

shipping.get("/fee", async (req, res) => {
    try {
        // Lấy dữ liệu từ query string
        const { to_district_id, to_ward_code, weight } = req.query;

        // Kiểm tra đầu vào hợp lệ
        if (!to_district_id || !to_ward_code || !weight) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        }
        
        const response = await axios.get(
            "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            {
                headers: {
                    "Content-Type": "application/json",
                    "Token": process.env.GHN_TOKEN,
                    "ShopId": process.env.GHN_SHOP_ID,
                },
                params: { 
                    service_type_id: 2,
                    from_district_id: 3440,
                    from_ward_code: "13009",
                    to_district_id,
                    to_ward_code,
                    weight,
                },
            }
        );

        res.json(response.data );
    } catch (error) {
        console.error("Error fetching shipping fee:", error.response?.data || error.message);
        res.status(500).json({ error: "Không thể tính phí vận chuyển" });
    }
});


module.exports = shipping