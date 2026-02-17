import type { MigrationFn } from "umzug";
import { MigrationContext } from "./2026.02.16T13.36.33.create-user.js";
import { DataTypes } from "sequelize";

export const up: MigrationFn<MigrationContext> = async ({
  context: { sequelize },
}) => {
  await sequelize.getQueryInterface().sequelize.transaction((t) => {
    return Promise.all([
      sequelize.getQueryInterface().addColumn(
        "users",
        "refreshToken",
        {
          type: DataTypes.TEXT,
        },
        { transaction: t },
      ),
    ]);
  });
};

export const down: MigrationFn<MigrationContext> = async ({
  context: { sequelize },
}) => {
  await sequelize.getQueryInterface().sequelize.transaction((t) => {
    return Promise.all([
      sequelize
        .getQueryInterface()
        .removeColumn("users", "refreshToken", { transaction: t }),
    ]);
  });
};
