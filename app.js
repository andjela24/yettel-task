require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./route/authRoute");
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    staus: "success",
    message: "REST APIs are working",
  });
});

// all routes are be here
app.use("/api/v1/auth", authRouter);
app.use("*", (req, res, next) => {
  res.status(404).json({
    staus: "Fail",
    message: "Route not found",
  });
});

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
  console.log("Server up and running on port", PORT);
});
