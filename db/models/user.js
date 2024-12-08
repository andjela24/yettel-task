"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const task = require("./task");
const bcrypt = require("bcryptjs");
const AppError = require("../../services/appError");

const user = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "First Name cannot be null.",
        },
        notEmpty: {
          msg: "First Name cannot be empty.",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Last Name cannot be null.",
        },
        notEmpty: {
          msg: "Last Name cannot be empty.",
        },
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Username cannot be null.",
        },
        notEmpty: {
          msg: "Username cannot be empty.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email cannot be null.",
        },
        notEmpty: {
          msg: "Email cannot be empty.",
        },
        isEmail: {
          msg: "Email is not in valid format.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password cannot be null.",
        },
        notEmpty: {
          msg: "Password cannot be empty.",
        },
      },
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (this.password.length < 8) {
          throw new AppError("Password length must be grater than 8.", 400);
        }
        if (value === this.password) {
          const hashPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashPassword);
        } else {
          throw new AppError(
            "Password and confirm passweord must be the same.",
            400
          );
        }
      },
    },
    role: {
      type: DataTypes.ENUM("BASIC", "ADMIN"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role cannot be null.",
        },
        notEmpty: {
          msg: "Role cannot be empty.",
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true, //enable soft delete
    freezeTableName: true,
    modelName: "user",
  }
);

user.hasMany(task, { foreignKey: "createdBy" });
task.belongsTo(user, {
  foreignKey: "createdBy",
});

module.exports = user;
