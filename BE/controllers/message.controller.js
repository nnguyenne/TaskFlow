// const Message = require("../models/message.model");
// const Conversation = require("../models/conversation.model");

// // Gửi tin nhắn trong đoạn chat
// const sendMessage = async (req, res) => {
//   try {
//     const sender = req.user._id;
//     const { conversationId, message } = req.body;

//     if (!conversationId || !message) {
//       return res.status(400).json({ error: "Thiếu conversationId hoặc message" });
//     }

//     const newMessage = await Message.create({ conversation: conversationId, sender, message });

//     // Cập nhật thời gian hoạt động của đoạn chat
//     await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

//     res.status(201).json(newMessage);
//   } catch (err) {
//     res.status(500).json({ error: "Lỗi server", details: err.message });
//   }
// };

// // Lấy tin nhắn theo đoạn chat
// const getMessagesByConversation = async (req, res) => {
//   try {
//     const { conversationId } = req.params;

//     const messages = await Message.find({ conversation: conversationId })
//       .populate("sender", "-password")
//       .sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: "Lỗi server", details: err.message });
//   }
// };

// module.exports = {
//   sendMessage,
//   getMessagesByConversation
// };


// 📁 controllers/message.controller.js
const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");

// ✅ Gửi tin nhắn trong đoạn chat (qua API)
const sendMessage = async (req, res) => {
  try {
    const sender = req.user._id; // + người gửi lấy từ token đã xác thực
    const { conversationId, message } = req.body; // + lấy ID đoạn chat và nội dung

    if (!conversationId || !message) {
      return res.status(400).json({ error: "Thiếu conversationId hoặc message" });
    }

    // + tạo tin nhắn mới trong DB
    const newMessage = await Message.create({ conversation: conversationId, sender, message });

    // + cập nhật thời gian hoạt động của đoạn chat (hiển thị theo recent)
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

    // + cần populate "sender" để phía FE lấy được info người gửi (vd: fullName)
    const fullMsg = await newMessage.populate("sender", "-password");

    // + nếu request có chứa socket.io, thì gửi realtime luôn
    if (req.io) {
      req.io.to(conversationId).emit("receiveMessage", fullMsg);
    }

    res.status(201).json(fullMsg); // + phản hồi về tin nhắn đã lưu và đã populate
  } catch (err) {
    res.status(500).json({ error: "Lỗi server", details: err.message });
  }
};

// ✅ Lấy tin nhắn theo đoạn chat (khi vào phòng chat)
const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // + tìm các tin nhắn thuộc đoạn chat đó, có info người gửi
    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "-password") // + hiển thị tên người gửi, ẩn password
      .sort({ createdAt: 1 }); // + sắp theo thời gian tăng dần (cũ -> mới)

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server", details: err.message });
  }
};

module.exports = {
  sendMessage,
  getMessagesByConversation
};
