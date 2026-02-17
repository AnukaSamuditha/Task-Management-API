import { db } from "../configs/database.js";
import { DataTypes, Model } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../types/index.js";

const User = db.define<Model<UserAttributes, UserCreationAttributes>>(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [6, 50],
      },
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      validate: {
        isEmail: true,
        len: [5, 254],
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationCode: DataTypes.INTEGER,
    emailVerificationExpires: DataTypes.DATE,
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  },
);

export default User;
