import type { MigrationFn } from "umzug";
import { type Sequelize, DataTypes } from "sequelize";

export type MigrationContext = {
  sequelize: Sequelize;
  DataTypes: typeof DataTypes;
};

export const up: MigrationFn<MigrationContext> = async ({
  context: { sequelize },
}) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.createTable("tasks", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },

    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "medium",
    },

    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addIndex("tasks", ["userID"]);
  await queryInterface.addIndex("tasks", ["priority"]);
  await queryInterface.addIndex("tasks", ["status"]);
};

export const down: MigrationFn<MigrationContext> = async ({
  context: { sequelize },
}) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.dropTable("tasks");
};
