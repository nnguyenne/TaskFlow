// const Conversation = require("../models/conversation.model");

// // Tạo đoạn chat riêng giữa 2 người
// const createPrivateConversation = async (req, res) => {
//   try {
//     const currentUserId = req.user._id;
//     const { otherUserId } = req.body;

//     if (!otherUserId) {
//       return res.status(400).json({ error: "Thiếu ID người nhận!" });
//     }

//     // Kiểm tra nếu đã có cuộc trò chuyện
//     let conversation = await Conversation.findOne({
//       isGroup: false,
//       members: { $all: [currentUserId, otherUserId], $size: 2 }
//     });

//     // Nếu chưa có, tạo mới
//     if (!conversation) {
//       conversation = await Conversation.create({
//         isGroup: false,
//         members: [currentUserId, otherUserId]
//       });
//     }

//     res.status(201).json(conversation);
//   } catch (err) {
//     res.status(500).json({ error: "Lỗi server", details: err.message });
//   }
// };

// // Lấy tất cả đoạn chat của user hiện tại
// const getMyConversations = async (req, res) => {
//   try {
//     const currentUserId = req.user._id;

//     const conversations = await Conversation.find({
//       members: currentUserId
//     })
//       .populate("members", "-password") // ẩn password
//       .sort({ updatedAt: -1 });

//     res.json(conversations);
//   } catch (err) {
//     res.status(500).json({ error: "Lỗi server", details: err.message });
//   }
// };

// module.exports = {
//   createPrivateConversation,
//   getMyConversations
// };


// 📁 controllers/conversation.controller.js
const Conversation = require("../models/conversation.model");

// ✅ Tạo đoạn chat riêng giữa 2 người
const createPrivateConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id; // + người đang đăng nhập
    const { receiverId } = req.body; // ✅ đã sửa lại từ otherUserId ➜ receiverId

    if (!receiverId) {
      return res.status(400).json({ error: "Thiếu ID người nhận!" });
    }

    // + tìm xem 2 người này đã có đoạn chat chưa
    let conversation = await Conversation.findOne({
      isGroup: false, // + chỉ tìm đoạn chat riêng (1-1)
      members: { $all: [currentUserId, receiverId], $size: 2 }
    });

    // + nếu chưa có, tạo mới
    if (!conversation) {
      conversation = await Conversation.create({
        isGroup: false,
        members: [currentUserId, receiverId]
      });
    }

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server", details: err.message });
  }
};

// ✅ Lấy danh sách các đoạn chat mà user hiện tại tham gia
const getMyConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const conversations = await Conversation.find({
      members: currentUserId
    })
      .populate("members", "-password") // + lấy thông tin các thành viên
      .sort({ updatedAt: -1 }); // + đoạn chat nào có hoạt động gần nhất sẽ lên đầu

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server", details: err.message });
  }
};

module.exports = {
  createPrivateConversation,
  getMyConversations
};
