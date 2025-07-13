// // middlewares/auth.middleware.js
// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// module.exports = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) return res.status(401).json({ message: "Thiếu token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // lưu thông tin user vào req
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token không hợp lệ" });
//   }
// };

require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra header hợp lệ
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token hoặc sai định dạng" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Lấy đúng token sau "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
