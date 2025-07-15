require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app); // DÙNG `server` để tích hợp Socket.IO

// MongoDB
const PORT = process.env.PORT || 3002;

// Lấy routes
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.routes");
const conversationRoutes = require("./routes/conversation.routes");
const messageRoutes = require("./routes/message.routes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Kết nối MongoDB thành công");
  } catch (error) {
    console.log("❌ Kết nối thất bại", error.message);
  }
};
connectDB();

// // Khởi tạo Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "https://taskflow-nguyenne.vercel.app"
//     ],
//     methods: ["GET", "POST"]
//   }
// });

// // Middleware xác thực JWT cho Socket
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("Thiếu token"));

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.user = decoded; // Gắn user info vào socket
//     next();
//   } catch (err) {
//     return next(new Error("Token không hợp lệ"));
//   }
// });

// // Gọi logic chat riêng theo đoạn chat/nhóm chat
// const chatSocket = require("./sockets/chatSocket");
// chatSocket(io);

// 🧠 GỌI SOKET.IO (đã gom vào thư mục sockets/)
const socketHandler = require("./sockets/index");
socketHandler(server);

// Khởi chạy server
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
