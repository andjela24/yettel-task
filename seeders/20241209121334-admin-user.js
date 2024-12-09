const bcrypt = require("bcryptjs");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let password = process.env.ADMIN_PASSWORD;
    const hashPassword = bcrypt.hashSync(password, 10);

    return queryInterface.bulkInsert("user", [
      {
        firstName: "Admin",
        lastName: "Admin",
        userName: "admin",
        email: process.env.ADMIN_EMAIL,
        password: hashPassword,
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user", { role: "ADMIN" }, {});
  },
};
