const { authentication, restrictTo } = require("../controllers/authController");
const {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = require("express").Router();

router
  .route("/")
  .post(authentication, restrictTo("BASIC"), createTask)
  .get(authentication, restrictTo("BASIC", "ADMIN"), getAllTask);

router
  .route("/:id")
  .get(authentication, restrictTo("BASIC", "ADMIN"), getTaskById)
  .patch(authentication, restrictTo("BASIC", "ADMIN"), updateTask)
  .delete(authentication, restrictTo("ADMIN"), deleteTask);

module.exports = router;
