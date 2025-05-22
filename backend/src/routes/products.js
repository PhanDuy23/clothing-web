const express = require("express")
const products = express.Router()
const cors = require("cors");
const db = require("../models/mysql.js")
const { checkRole, authenticateToken } = require("./auth.js")
products.use(cors())
products.use(express.json())
// lấy chi tiết sp theo slug
products.get("/detail/:slug", async (req, res) => {
    const { slug } = req.params;

    try {
        // Truy vấn sản phẩm từ bảng `products`
        const productQuery = `
            SELECT id, name, slug, sku, price, originalPrice, cost, categoryId, 
                   thumbnail, image_1, image_2, image_3, 
                   image_4, image_5, detailDescription, shortDescription, weight
            FROM products 
            WHERE slug = ?;
        `;
        const [[product]] = await db.query(productQuery, [slug]);

        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }

        // Truy vấn các thuộc tính (size, color, stock_quantity) từ `product_attributes`
        const attributesQuery = `
            SELECT size, color, quantity
            FROM product_attributes
            WHERE productId = ?;
        `;
        const [attributes] = await db.query(attributesQuery, [product.id]);

        // Chuyển các ảnh thành mảng `images`
        const images1 = Object.keys(product)
            .filter(key => key.startsWith("image_") && product[key])
            .map(key => product[key]);
        const images = [product.thumbnail, ...images1]
        // Tạo danh sách `sizes` và `colors`
        const sizes = [...new Set(attributes.map(attr => attr.size))]; // Lấy danh sách size duy nhất
        const colors = [...new Set(attributes.map(attr => attr.color))]; // Lấy danh sách màu duy nhất
        // tách cách image_ ra
        const filteredProduct = Object.fromEntries(
            Object.entries(product).filter(([key]) => !key.startsWith('image_'))
        );
        // Trả về kết quả JSON
        res.json({
            ...filteredProduct,
            images, // Ảnh dưới dạng mảng
            sizes,  // Danh sách kích thước
            colors, // Danh sách màu
            attributes // Chi tiết từng thuộc tính (size, color, stock)
        });

    } catch (error) {
        console.error("❌ Lỗi truy vấn MySQL:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// lấy ds sản phẩm theo categoryid 
products.get("/", async (req, res) => {
    try {
        const { categoryId, status, minPrice, maxPrice } = req.query;
        const limit = parseInt(req.query.limit) || parseInt(process.env.QRY_LIMIT) || 10; // Mặc định 10 sản phẩm/trang
        const page = parseInt(req.query.page) || parseInt(process.env.QRY_PAGE) || 1; // Mặc định trang 1   
        const offset = (page - 1) * limit;
        const min = parseFloat(Number(minPrice)) || 0;
        const max = parseFloat(maxPrice) || 100000000; // một số rất lớn nếu không có giới hạn
        
        let query = `
  SELECT 
    p.id, p.slug, p.name, p.thumbnail, p.price, p.status, p.discount,
    p.shortDescription, p.originalPrice, p.created_at,
    (SELECT SUM(quantity) FROM product_attributes WHERE productId = p.id) AS quantity
  FROM products p
  WHERE p.status = ? AND p.price BETWEEN ? AND ?
`;

        const params = [status, min, max];

        if (categoryId && categoryId !== "all") {
            query += ` AND categoryId = ?`;
            params.push(categoryId);
        }

        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [products] = await db.query(query, params);

        // Lấy tổng số bản ghi phù hợp
        let countQuery = `
        SELECT COUNT(*) AS total
        FROM products
        WHERE status = ? AND price BETWEEN ? AND ?`;

        const countParams = [status, min, max];

        if (categoryId && categoryId !== "all") {
            countQuery += ` AND categoryId = ?`;
            countParams.push(categoryId);
        }

        const [[{ total }]] = await db.query(countQuery, countParams);


        res.json({
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
            products
        });

    } catch (err) {
        console.error("❌ Lỗi server:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

products.get("/discount", async (req, res) => {
    try {
        // const category_id = Number(req.query.categoryId);
        const limit = parseInt(req.query.limit) || parseInt(process.env.QRY_LIMIT) || 10; // Mặc định 10 sản phẩm/trang
        const page = parseInt(req.query.page) || parseInt(process.env.QRY_PAGE) || 1; // Mặc định trang 1
        const offset = (page - 1) * limit;
        // const { minPrice, maxPrice } = req.query
        // if (isNaN(category_id)) {
        //     return res.status(400).json({ error: "category_id không hợp lệ" });
        // }

        // Lấy danh sách sản phẩm theo category_id
        // const min = parseFloat(Number(minPrice)) || 0 ;
        // const max = parseFloat(maxPrice) || 100000000; // một số rất lớn nếu không có giới hạn

        const [products] = await db.query(
            `SELECT id, slug, name, thumbnail, discount, price, shortDescription, originalPrice , created_at
            FROM products 
            WHERE discount > 20 and status = 1
            LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        // Lấy tổng số bản ghi phù hợp
        const [[{ total }]] = await db.query(
            "SELECT COUNT(*) AS total FROM products WHERE discount > 20 ",
        );

        // if (products.length === 0) {
        //     return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        // }

        res.json({
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
            products
        });

    } catch (err) {
        console.error("❌ Lỗi server:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// GET /products/count
products.get("/count", async (req, res) => {
    try {
        const [[result]] = await db.query(
            `SELECT COUNT(*) AS totalProducts FROM products WHERE status = 1`
        );
        res.json({ totalProducts: result.totalProducts });
    } catch (error) {
        console.error("❌ Lỗi khi đếm sản phẩm:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});


products.post("/", authenticateToken, checkRole("admin"), async (req, res) => {
    const {
        name, slug, sku, price, originalPrice, cost,
        detailDescription, shortDescription, imageUrls,
        categoryId, weight, status, discount, attributes // Đây là mảng [{ color, size, quantity }]
    } = req.body;
    if (!name || !slug || !sku || !price || !categoryId) {
        return res.status(400).json({
            success: false,
            message: "Thiếu dữ liệu bắt buộc: name, slug, sku, price, categoryId"
        });
    }

    if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ message: "Không có ảnh nào được upload" });
    }

    try {
        const thumbnail = imageUrls[0]
        const extraImages = imageUrls.slice(1, 7); // Lấy tối đa 6 ảnh phụ

        // Điền các ảnh phụ vào từng biến tương ứng
        const [image_1, image_2, image_3, image_4, image_5] = extraImages;

        // Lưu vào database

        const [result] = await db.query(
            `INSERT INTO products (
                  name, slug, sku, price, originalPrice, cost,
                  thumbnail, image_1, image_2, image_3, image_4, image_5,
                  detailDescription, shortDescription,
                  categoryId, weight, status,
                  created_at, updated_at, discount
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
            [
                name, slug, sku, price, originalPrice || null, cost || null,
                thumbnail || null,
                image_1 || null, image_2 || null, image_3 || null,
                image_4 || null, image_5 || null,
                detailDescription || null, shortDescription || null,
                categoryId, weight || null, status || 1,
                discount || 0
            ]
        );
        const productId = result.insertId;

        // Parse mảng attributes (nếu là string)
        const attributeArray = typeof attributes === "string" ? JSON.parse(attributes) : attributes;

        // Thêm vào bảng product_attributes
        for (const attr of attributeArray) {
            const { color, size, quantity } = attr;

            if (!color || !size || !quantity) continue; // Bỏ qua dòng thiếu dữ liệu

            await db.query(
                `INSERT INTO product_attributes 
                (productId, color, size, quantity, created_at, updated_at) 
                VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [productId, color, size, quantity]
            );
        }

        return res.status(201).json({
            success: true,
            message: "Sản phẩm đã được tạo thành công",
            productId: result.insertId
        });

    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error.sqlMessage);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi thêm sản phẩm"
        });
    }
}
);

products.put("/:id", authenticateToken, checkRole("admin"), async (req, res) => {
    const { id } = req.params;
    const {
        name, slug, sku, price, originalPrice, cost,
        detailDescription, shortDescription, imageUrls, images,
        categoryId, weight, status, discount, attributes
    } = req.body;

    try {
        const fields = [];
        const values = [];

        const addField = (fieldName, fieldValue) => {
            if (fieldValue == 0 || fieldValue) {
                fields.push(`${fieldName} = ?`);
                values.push(fieldValue);
            }
        };

        // Nếu có ảnh mới
        let thumbnail = null, image_1 = null, image_2 = null, image_3 = null, image_4 = null, image_5 = null;
        let imageUrlNew
        if (imageUrls && images) {
            imageUrlNew = [...imageUrls, ...images]


            if (imageUrlNew) {
                thumbnail = imageUrls[0];

                [image_1, image_2, image_3, image_4, image_5] = imageUrls.slice(1, 7);
            }
            const [newThumbnail, newImage1, newImage2, newImage3, newImage4, newImage5] =
                [0, 1, 2, 3, 4, 5].map(i =>
                    imageUrls[i] !== undefined ? null : imageUrlNew[i]
                );
            [thumbnail, image_1, image_2, image_3, image_4, image_5] =
                [newThumbnail, newImage1, newImage2, newImage3, newImage4, newImage5];
    
        }

        // Thêm các trường có dữ liệu
        addField("name", name);
        addField("slug", slug);
        addField("sku", sku);
        addField("price", price);
        addField("originalPrice", originalPrice);
        addField("cost", cost);
        addField("detailDescription", detailDescription);
        addField("shortDescription", shortDescription);
        addField("categoryId", categoryId);
        addField("weight", weight);
        addField("status", status);
        addField("discount", discount);

        if (thumbnail) addField("thumbnail", thumbnail);
        if (image_1) addField("image_1", image_1);
        if (image_2) addField("image_2", image_2);
        if (image_3) addField("image_3", image_3);
        if (image_4) addField("image_4", image_4);
        if (image_5) addField("image_5", image_5);

        // Luôn cập nhật updated_at
        fields.push("updated_at = NOW()");

        // Nếu không có trường nào được gửi thì báo lỗi
        if (fields.length === 1 && fields[0] === "updated_at = NOW()") {
            return res.status(400).json({
                success: false,
                message: "Không có dữ liệu nào được gửi để cập nhật"
            });
        }

        // Thêm id vào cuối values
        values.push(id);

        const updateQuery = `
            UPDATE products 
            SET ${fields.join(", ")} 
            WHERE id = ?
        `;



        await db.query(updateQuery, values);
        // Cập nhật attributes nếu được gửi lên
        if (attributes !== undefined) {
            const attributeArray = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
            // Xóa cũ
            await db.query("DELETE FROM product_attributes WHERE productId = ?", [id]);
            // Thêm mới
            for (const attr of attributeArray) {
                const { color, size, quantity } = attr;
                if (!color || !size || !quantity) continue;
                await db.query(
                    `INSERT INTO product_attributes 
                    (productId, color, size, quantity, created_at, updated_at)
                    VALUES (?, ?, ?, ?, NOW(), NOW())`,
                    [id, color, size, quantity]
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật sản phẩm thành công"
        });

    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật sản phẩm"
        });
    }
});

products.get("/quantity/:productId", async (req, res) => {
    try {
        const { productId } = req.params

        const [[result]] = await db.query(
            `SELECT SUM(quantity)  as quantity
            FROM product_attributes
            WHERE productId = ?`, [productId]
        );

        res.json({ quantity: result });
    } catch (error) {
        console.error("❌ Lỗi khi tính quantity:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

module.exports = products
