import User from "./user.model.js";
import Task from "./task.model.js";

const models = {
  User,
  Task,
};

User.hasMany(Task, {
  foreignKey: "userID",
  as: "tasks",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Task.belongsTo(User, {
  foreignKey: "userID",
  as: "user",
});

export default models;
