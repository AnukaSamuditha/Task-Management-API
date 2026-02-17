import type { MigrationFn } from "umzug";
import { type Sequelize, DataTypes } from "sequelize";

export type MigrationContext = {
  sequelize: Sequelize;
  DataTypes: typeof DataTypes;
};

export const up: MigrationFn<MigrationContext> = async ({
  context: { sequelize },
}) => {
  await sequelize.getQueryInterface().createTable("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
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
    createdAt:{
      type : DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt:{
      type : DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  await sequelize.getQueryInterface().addIndex("users", ["email"], {
    unique: true,
  });
};
export const down: MigrationFn<MigrationContext> = async ({
  context: { sequelize },
}) => {
  await sequelize.getQueryInterface().dropTable("users");
};
