const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const AppError = require("../services/appError");
const user = require("../db/models/user");
const catchAsync = require("../services/catchAsync");

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const role = req.user.role;
  const userIdToUpdate = parseInt(req.params.id);
  const body = req.body;

  if (body.role) {
    return next(new AppError("You cannot update the role.", 403));
  }

  if (role === "BASIC" && userId !== userIdToUpdate) {
    return next(
      new AppError("You do not have permission to update this user.", 403)
    );
  }

  const result = await user.findByPk(userIdToUpdate);

  if (!result) {
    return next(new AppError("User not found.", 404));
  }

  if (body.password) {
    if (body.password.length < 8) {
      return next(
        new AppError("Password length must be at least 8 characters.", 400)
      );
    }

    if (body.password !== body.confirmPassword) {
      return next(
        new AppError("Password and confirm password must be the same.", 400)
      );
    }

    body.password = await bcrypt.hash(body.password, 10);
  }

  result.firstName = body.firstName;
  result.lastName = body.lastName;
  result.username = body.username;
  result.email = body.email;
  result.password = body.password;

  const updatedResult = await result.save();

  return res.json({
    status: "success",
    data: updatedResult,
  });
});

module.exports = { updateUser };
