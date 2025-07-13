const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth.middleware");

const userController = require("../controllers/users.controller");

router.get("/me", checkAuth, userController.getMe)//Lấy thông tin chính mình check theo token
router.get("/all", checkAuth, userController.getAllUser)//Lấy thông tin chính mình check theo token
//router.put("/:id", checkAuth, userController.updateUser);//Đổi thông tin của chính mình check theo token
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/check", checkAuth, userController.checkUser);

module.exports = router;