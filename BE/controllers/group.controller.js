const { use } = require("react");
const Group = require("../models/group.model")


exports.createGroup = async (req, res) => {
  try {
    const adminId = req.user_id;
    const { name, members } = req.body;

    if (!adminId || !name || !Array.isArray(members)) {
      return res.status(400), json({ error: "Không tìm thấy dữ liệu" });
    }
    // Tạo group mới
    const group = await Group.create({
      name: name,
      members: [...members, adminId], // thêm admin vào danh sách thành viên
      createdBy: adminId
    });

    // Tạo đoạn chat group
    const conversation = await conversation.create({
      isGroup: true,
      name: name,
      members: [...members, adminId],
      groupAdmin: adminId,
      groupId: group._id
    })

    return res.status(201).json({ message: "Tạo thành công", group, conversation });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server", details: err.message });
  }
}