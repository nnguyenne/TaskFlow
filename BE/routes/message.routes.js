const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth.middleware");
const messageController = require("../controllers/message.controller");

// Gửi tin nhắn (yêu cầu conversationId và nội dung)
router.post("/", checkAuth, messageController.sendMessage);

// Lấy tất cả tin nhắn trong 1 đoạn chat
router.get("/:conversationId", checkAuth, messageController.getMessagesByConversation);

module.exports = router;
