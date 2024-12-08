require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./routes/authRoute");
const taskRouter = require("./routes/taskRoute");
const userRouter = require("./routes/userRoute");
const catchAsync = require("./services/catchAsync");
const AppError = require("./services/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    staus: "success",
    message: "REST APIs are working",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError("This is error.", 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
  console.log("Server up and running");
});
