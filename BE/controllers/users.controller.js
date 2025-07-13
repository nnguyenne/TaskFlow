const User = require("../models/Users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// validate đơn giản
function validateUser(username, password) {
  if (!username || !password) return "Vui lòng nhập đủ thông tin (* là bắt buộc)";
  if (username.length < 3) return "Username phải ít nhất 3 ký tự";
  if (password.length < 6) return "Password phải ít nhất 6 ký tự";
  return null;
}

function validateRegister(data) {
  const { username, password, fullName, email, phone, role } = data;
  if (!username || !password || !fullName || !email || !phone || !role)
    return "Vui lòng điền đầy đủ các trường *bắt buộc";
  if (username.length < 3) return "Username phải có ít nhất 3 ký tự";
  if (password.length < 6) return "Password phải có ít nhất 6 ký tự";
  return null;
}

exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lấy dữ liệu thất bại", error })
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
}

// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // ✅ So sánh với ID từ token để bảo vệ
//     if (id !== req.user._id) {
//       return res.status(403).json({ message: "Bạn không có quyền sửa user này" });
//     }

//     const { username, password } = req.body;
//     const updateData = {};

//     if (username) updateData.username = username;
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       const hashed = await bcrypt.hash(password, salt);
//       updateData.password = hashed;
//     }

//     const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
//     if (!updated) {
//       return res.status(404).json({ message: "Không tìm thấy user" });
//     }

//     res.status(201).json({ message: "Cập nhật thành công", user: updateData });
//   } catch (error) {
//     console.error("Lỗi update:", error);
//     res.status(500).json({ message: "Lỗi server", error });
//   }
// };


exports.register = async (req, res) => {
  try {
    const { username, password, fullName, email, phone, role, avatar, createdAt, status } = req.body;

    const err = req.body;
    // 1. Validate đầu vào
    const error = validateRegister(err);
    if (error) {
      return res.status(400).json({ message: error });
    }

    // 2. Kiểm tra trùng username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Tài khoản đã tồn tại" });
    }

    const salt = await bcrypt.genSalt(10); // tạo salt
    const hashedPassword = await bcrypt.hash(password, salt); // mã hóa password
    // 3. Tạo user mới
    const newUser = new User({
      username,
      password: hashedPassword,
      fullName,
      email,
      phone,
      role,
      avatar: avatar || "",
      createdAt: new Date(),
      status: true
    });
    await newUser.save();

    // 4. Trả kết quả
    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    console.error("Lỗi register:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  const error = validateUser(username, password);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const fUser = await User.findOne({ username });
  if (!fUser) {
    return res.status(401).json({ message: "Tài khoản không tồn tại!" })
  }
  const isMatch = await bcrypt.compare(password, fUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Mật khẩu không đúng" });
  }
  // ✅ Tạo token
  const token = jwt.sign(
    { _id: fUser._id, username: fUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  const user = fUser.toObject();
  delete user.password;
  res.status(201).json({
    message: "Đăng nhập thành công",
    user: user,
    token, // gửi token về
  });
};

exports.checkUser = async (req, res) => {
  try {
    const user = req.user;
    const { userID } = req.body;

    if (!userID || userID !== user._id.toString()) {
      return res
        .status(400)
        .json({ exists: false, message: "Thông tin dữ liệu không khớp!" });
    }

    // ✅ Tìm user theo _id
    const fUser = await User.findById(userID);
    if (fUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Lỗi checkUser:", error);
    res.status(500).json({ exists: false, message: "Lỗi server" });
  }
};
