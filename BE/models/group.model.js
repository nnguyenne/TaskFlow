const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên nhóm
  description: { type: String },          // Mô tả nhóm
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người tạo nhóm
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách thành viên
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);