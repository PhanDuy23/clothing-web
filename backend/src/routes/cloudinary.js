// import các thư viện cần thiết
const express = require("express");
const cld = require("../models/cloudinary.js")
const multer = require("multer");
const cors = require("cors"); 
const streamifier = require("streamifier");
const cloudinary = express.Router();
const {checkRole, authenticateToken} = require("./auth.js")
cloudinary.use(cors({
    origin: "http://localhost:5173", // cho phép frontend gọi
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
// Cấu hình Multer để xử lý file upload (dùng bộ nhớ đệm - buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = async (buffer, folder) => {
    try {
        let height, width
        if(folder == "banners"){
            height = 750,
            width = 1920
        }else{
            height = 500
            width = 400
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cld.uploader.upload_stream(
                {
                    folder,
                    transformation: [
                        { width: width, height: height, crop: "scale" },
                        { quality: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            
            streamifier.createReadStream(buffer).pipe(stream);
        });

        return result.secure_url;
    } catch (error) {
        console.error("Lỗi upload ảnh lên Cloudinary:", error);
        throw new Error("Không thể upload ảnh. Vui lòng thử lại sau.");
    }
};
// Route upload nhiều ảnh
cloudinary.post("/upload/image", upload.array("images", 10), authenticateToken, checkRole("admin"),   async (req, res) => {

    try {
        if (!req.files || req.files.length === 0) {  
            return res.status(400).json({ success: false, message: "Không có ảnh nào được tải lên." });
        }
        const folder = req.body.folder
        if (!folder) {
            return res.status(400).json({ success: false, message: "chưa truyền folder lưu ảnh" });
        }
        const uploadedUrls = [];

        for (const file of req.files) {

            const url = await uploadToCloudinary(file.buffer, folder);
            uploadedUrls.push(url);
        }

        return res.status(200).json({
            success: true,
            message: "Upload thành công",
            urls: uploadedUrls
        });
    } catch (error) {
        console.error("Lỗi khi upload nhiều ảnh:", error);
        return res.status(500).json({ success: false, message: "Lỗi server khi upload ảnh." });
    }
});

module. exports = cloudinary ;
