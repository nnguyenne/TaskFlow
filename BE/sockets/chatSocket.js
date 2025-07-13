// const Message = require("../models/message.model");
// const Conversation = require("../models/conversation.model");

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     const userId = socket.user._id;
//     console.log("📡 User kết nối:", userId);

//     // Tham gia vào 1 đoạn chat
//     socket.on("joinRoom", (conversationId) => {
//       socket.join(conversationId);
//       console.log(`👤 User ${userId} vào room ${conversationId}`);
//     });

//     // Gửi tin nhắn realtime
//     socket.on("sendMessage", async ({ conversationId, message }) => {
//       if (!message || !conversationId) return;

//       try {
//         const newMsg = await Message.create({
//           conversation: conversationId,
//           sender: userId,
//           message
//         });

//         await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

//         const populatedMsg = await newMsg.populate("sender", "-password"); // 👈 thêm dòng này
//         io.to(conversationId).emit("receiveMessage", populatedMsg); // 👈 gửi dữ liệu đã populate

//         // io.to(conversationId).emit("receiveMessage", newMsg);
//       } catch (err) {
//         console.error("❌ Lỗi gửi tin nhắn:", err.message);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ User ngắt kết nối:", userId);
//     });
//   });
// };
const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.user._id;
    console.log("📡 User kết nối:", userId);

    // ✅ User vào phòng chat cụ thể
    socket.on("joinRoom", ({ conversationId }) => {
      socket.join(conversationId);
      console.log(`👤 User ${userId} vào room ${conversationId}`);
    });

    // ✅ Gửi tin nhắn realtime qua socket
    // socket.on("sendMessage", async ({ conversationId, message }) => {
    //   if (!message || !conversationId) return;

    //   try {
    //     // + lưu vào DB
    //     const newMsg = await Message.create({
    //       conversation: conversationId,
    //       sender: userId,
    //       message
    //     });

    //     // + cập nhật thời gian mới nhất
    //     await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

    //     // + lấy thêm info người gửi để bên frontend hiển thị
    //     const populatedMsg = await Message.findById(newMsg._id).populate("sender", "-password");

    //     // + gửi cho tất cả client đang ở trong room
    //     io.to(conversationId).emit("receiveMessage", populatedMsg);
    //   } catch (err) {
    //     console.error("❌ Lỗi gửi tin nhắn:", err.message);
    //   }
    // });
    socket.on("sendMessage", async ({ conversationId, message }) => {
      if (!message || !conversationId) return;

      try {
        // + lưu vào DB
        const newMsg = await Message.create({
          conversation: conversationId,
          sender: userId,
          message
        });

        // + cập nhật thời gian mới nhất
        await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

        // ✅ cách chắc chắn lấy được sender đầy đủ
        const populatedMsg = await Message.findById(newMsg._id).populate("sender", "-password");

        // + gửi cho tất cả client đang ở trong room
        io.to(conversationId).emit("receiveMessage", populatedMsg);
      } catch (err) {
        console.error("❌ Lỗi gửi tin nhắn:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User ngắt kết nối:", userId);
    });
  });
};
