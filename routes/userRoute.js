const { authentication, restrictTo } = require("../controllers/authController");
const { updateUser } = require("../controllers/userController");

const router = require("express").Router();

router
  .route("/:id")
  .patch(authentication, restrictTo("BASIC", "ADMIN"), updateUser);

module.exports = router;
