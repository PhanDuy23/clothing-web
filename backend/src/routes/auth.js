const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "chưa có token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // console.log("token ", authHeader);
        
        if (err) return res.status(403).json({ message: "token lỗi không khớp với người dùng" });
        req.user = user;
        
        next();
    });
}

function checkRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        next();
    };
}

module.exports = {
    authenticateToken,
    checkRole
  };
