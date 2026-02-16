import { Sequelize } from "sequelize";

export const db = new Sequelize(process.env.DB_URL as string, {
  logging: (...msg) => console.log(msg),
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 15000,
  },
});

export const connectDB = async () => {
  return await db
    .authenticate()
    .then(() => {
      console.info("Database connected successfully!");
    })
    .catch((err) => {
      console.error("Error connecting to the database : ", err);
    });
};