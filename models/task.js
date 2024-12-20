"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

module.exports = sequelize.define(
  "task",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Body cannot be null.",
        },
        notEmpty: {
          msg: "Body cannot be empty.",
        },
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
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
    paranoid: true,
    freezeTableName: true,
    modelName: "task",
  }
);
