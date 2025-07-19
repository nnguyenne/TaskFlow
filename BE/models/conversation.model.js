const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);