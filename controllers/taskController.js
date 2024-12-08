const task = require("../db/models/task");
const user = require("../db/models/user");
const AppError = require("../services/appError");
const catchAsync = require("../services/catchAsync");

const createTask = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;
  const newTask = await task.create({
    body: body.body,
    createdBy: userId,
  });

  return res.status(201).json({
    status: "success",
    data: newTask,
  });
});

const getAllTask = catchAsync(async (req, res, next) => {
  const { id: userId, role } = req.user;
  const { page = 1, limit = 10, order = "asc" } = req.query;

  const pageNumber = Math.max(parseInt(page), 1);
  const pageSize = Math.max(parseInt(limit), 1);
  const offset = (pageNumber - 1) * pageSize;

  const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  const condition = role === "BASIC" ? { createdBy: userId } : {};

  const { rows: tasks, count: total } = await task.findAndCountAll({
    where: condition,
    limit: pageSize,
    offset,
    order: [["id", sortOrder]],
  });

  const totalPages = Math.ceil(total / pageSize);

  return res.json({
    status: "success",
    data: tasks,
    meta: {
      total,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    },
  });
});

// May need to improve
const getTaskById = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  const result = await task.findByPk(taskId, { include: user });
  if (!result) {
    return next(new AppError("Task not found.", 400));
  }

  if (role === "BASIC" && result.createdBy !== userId) {
    return next(
      new AppError("You do not have permission to access this task", 403)
    );
  }
  return res.json({
    status: "success",
    data: result,
  });
});

const updateTask = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const body = req.body;

  const condition = role === "BASIC" ? { createdBy: userId } : {};

  const result = await task.findOne({
    where: { id: taskId, condition },
  });

  if (!result) {
    return next(new AppError("Task not found.", 404));
  }

  result.body = body.body;

  const updatedResult = await result.save();

  return res.json({
    status: "success",
    data: updatedResult,
  });
});

//Only ADMIN can delete task
const deleteTask = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const body = req.body;

  const result = await task.findOne({
    where: { id: taskId },
  });

  if (!result) {
    return next(new AppError("Invalid task id", 400));
  }

  await result.destroy();

  return res.json({
    status: "success",
    message: "Record deleted successfully",
  });
});

module.exports = {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTask,
};
