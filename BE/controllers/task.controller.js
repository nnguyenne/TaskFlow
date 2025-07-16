const Task = require("../models/task.model");

// validate đơn giản
function validateCreateTask(data) {
  const { title, deadline, assignedTo, groupId, parentTask } = data;

  // Tiêu đề & hạn chót là bắt buộc
  if (!title || !deadline) {
    return "Vui lòng nhập đầy đủ thông tin: tiêu đề và hạn chót.";
  }

  if (typeof title !== "string" || title.trim().length < 3) {
    return "Tiêu đề công việc phải có ít nhất 3 ký tự.";
  }

  // Kiểm tra định dạng deadline
  const parsedDate = Date.parse(deadline);
  if (isNaN(parsedDate)) {
    return "Hạn chót không hợp lệ (phải là định dạng ngày hợp lệ).";
  }

  // Nếu có assignedTo, groupId, parentTask thì phải là ObjectId hợp lệ (24 ký tự hex)
  const isValidObjectId = (id) =>
    typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

  if (assignedTo && !isValidObjectId(assignedTo)) {
    return "Người được giao không hợp lệ.";
  }

  if (groupId && !isValidObjectId(groupId)) {
    return "Nhóm không hợp lệ.";
  }

  if (parentTask && !isValidObjectId(parentTask)) {
    return "Task cha không hợp lệ.";
  }

  return null;
}


exports.getTask = async (req, res) => {
  try {
    const userID = req.user._id; // Lấy từ token
    const { keyword = "", page = 1, limit = 5, sort = "createdAt_desc" } = req.query;

    if (!userID) {
      return res.status(400).json({ message: "Thiếu token" });
    }

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 5;
    const skip = (parsedPage - 1) * parsedLimit;

    // Bộ lọc
    const filter = {
      createdBy: userID, // Theo ID ngườ tạo
      parentTask: null, // Chỉ lấy task không phải task con
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    };

    // Xử lý sắp xếp
    let sortOption = {};
    const [sortField, sortOrder] = sort.split("_"); // VD: deadline_asc, createdAt_desc
    sortOption[sortField] = sortOrder === "asc" ? 1 : -1;

    // Truy vấn
    const parentTasks = await Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    const parentIds = parentTasks.map(task => task._id); // Lấy danh sách _id của task cha
    const subtasks = await Task.find({ parentTask: { $in: parentIds } }); // Lấy các task con có parentTask nằm trong danh sách

    const taskMap = {}; // ✅ THÊM: object để map task cha với subtasks
    parentTasks.forEach(task => {
      taskMap[task._id.toString()] = { ...task, subtasks: [] }; // Tạo cấu trúc có thêm `subtasks`
    });

    subtasks.forEach(sub => {
      const pid = sub.parentTask.toString();
      if (taskMap[pid]) {
        taskMap[pid].subtasks.push(sub); // Đẩy subtask vào đúng task cha
      }
    });

    const tasksWithSub = Object.values(taskMap);//

    const total = await Task.countDocuments(filter);
    const totalPage = Math.ceil(total / parsedLimit);

    // res.json({ data: tasks, totalPage });
    res.json({ data: tasksWithSub, totalPage });
  } catch (error) {
    console.log("Lỗi trong xuất dữ liệu (getTask):", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};


exports.createTask = async (req, res) => {
  try {
    const userID = req.user._id;
    const { title, description, assignedTo, groupId, parentTask, deadline } = req.body;

    if (!userID) {
      return res.status(400).json({ message: "Thiếu token" });
    }

    const err = validateCreateTask(req.body);
    if (err) {
      return res.status(400).json({ message: err })
    }

    const newTask = new Task({ title, description, createdBy: userID, assignedTo, groupId, parentTask, deadline });
    await newTask.save();

    res.status(201).json({ message: "Đã thêm thành công.", task: newTask })
  } catch (error) {
    console.log("Lỗi trong thêm dữ liệu (createTask):", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
}

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const userID = req.user._id; // Lấy ID người dùng từ token đã xác thực

    const { id } = req.params; // Lấy ID của task cần cập nhật từ URL
    const { title, description, assignedTo, groupId, parentTask, deadline, isCompleted } = req.body;

    // Kiểm tra token có hợp lệ không
    if (!userID) {
      return res.status(400).json({ message: "Thiếu token" });
    }

    // Kiểm tra dữ liệu đầu vào
    const err = validateCreateTask(req.body);
    if (err) {
      return res.status(400).json({ message: err });
    }

    // Cập nhật task theo ID, trả về task mới nhất sau khi cập nhật
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;
    if (groupId !== undefined) updateFields.groupId = groupId;
    if (parentTask !== undefined) updateFields.parentTask = parentTask;
    if (deadline !== undefined) updateFields.deadline = deadline;
    if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;

    const updatedTask = await Task.findByIdAndUpdate(id, updateFields, { new: true });

    // Nếu không tìm thấy task cần cập nhật
    if (!updatedTask) {
      return res.status(404).json({ message: "Không tìm thấy task." });
    }

    // Trả về kết quả thành công
    res.status(200).json({ message: "Đã cập nhật thành công.", task: updatedTask });
  } catch (error) {
    console.log("Lỗi trong updateTask:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};


// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const userID = req.user._id; // Lấy ID người dùng từ token
    const { id } = req.params; // Lấy ID task cần xoá từ URL

    // Kiểm tra token
    if (!userID) {
      return res.status(400).json({ message: "Thiếu token" });
    }

    // Tìm và xoá task theo ID
    const deletedTask = await Task.findByIdAndDelete(id);

    // Nếu không tìm thấy task
    if (!deletedTask) {
      return res.status(404).json({ message: "Không tìm thấy task." });
    }

    // Trả về kết quả thành công
    res.status(200).json({ message: "Đã xoá thành công.", task: deletedTask });
  } catch (error) {
    console.log("Lỗi trong deleteTask:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};
