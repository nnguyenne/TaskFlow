const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth.middleware");

const taskController = require("../controllers/task.controller");

// router.get("/", checkAuth, taskController.getTask);
// router.get("/all", checkAuth, taskController.getALLTodos);
router.get("/search", checkAuth, taskController.getTask);
router.post("/", checkAuth, taskController.createTask);
router.put("/:id", checkAuth, taskController.updateTask);
router.patch("/:id", checkAuth, taskController.updateTask);
router.delete("/:id", checkAuth, taskController.deleteTask);

module.exports = router;