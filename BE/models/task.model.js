const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tiêu đề task
  description: { type: String },           // Mô tả task
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người tạo task
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người được giao task
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null }, // Nếu task thuộc nhóm
  parentTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null }, // Nếu là subtask
  isCompleted: { type: Boolean, default: false }, // Hoàn thành chưa
  deadline: { type: Date }, // Hạn chót
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
