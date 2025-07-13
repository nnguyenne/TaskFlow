const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth.middleware");
const conversationController = require("../controllers/conversation.controller");

// Tạo đoạn chat riêng (giữa 2 người)
router.post("/", checkAuth, conversationController.createPrivateConversation);

// Lấy các đoạn chat của người dùng hiện tại
router.get("/", checkAuth, conversationController.getMyConversations);

module.exports = router;
