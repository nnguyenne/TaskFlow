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
// app.use("/groups", messageRoutes);

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


// 🧠 GỌI SOKET.IO (đã gom vào thư mục sockets/)
const socketHandler = require("./sockets/index");
socketHandler(server);

// Khởi chạy server
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
