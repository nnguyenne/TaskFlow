const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
// Gọi logic chat riêng theo đoạn chat/nhóm chat
const chatSocket = require("./chatSocket");
module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://taskflow-nguyenne.vercel.app"
      ],
      methods: ["GET", "POST"]
    }
  });

  // Middleware xác thực JWT cho Socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Thiếu token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Gắn user info vào socket
      next();
    } catch (err) {
      return next(new Error("Token không hợp lệ"));
    }
  });

  chatSocket(io);
}