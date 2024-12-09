require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const { swaggerSpec, swaggerUi } = require("./swagger");
const authRouter = require("./routes/authRoute");
const taskRouter = require("./routes/taskRoute");
const userRouter = require("./routes/userRoute");
const catchAsync = require("./services/catchAsync");
const AppError = require("./services/appError");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    staus: "success",
    message: "REST APIs are working",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Cannot find ${req.originalUrl} on this server!`, 404);
  })
);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.APP_PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
module.exports = app;
