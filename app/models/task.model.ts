import { db } from "../configs/database.js";
import { DataTypes, Model } from "sequelize";
import {
  TaskAttributes,
  TaskCreationAttributes,
  TaskPriority,
  TaskStatus,
} from "../types/index.js";

const Task = db.define<Model<TaskAttributes, TaskCreationAttributes>>(
  "task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: TaskStatus.PENDING,
      validate: {
        isIn: [Object.values(TaskStatus)],
      },
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: TaskPriority.MEDIUM,
      validate: {
        isIn: [Object.values(TaskPriority)],
      },
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    timestamps: true,
    indexes: [
        {fields: ["userID"]},
        {fields: ["priority"]},
        {fields: ["status"]}
    ]
  },
);

export default Task;
