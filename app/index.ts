import express, { Request, Response } from "express";
import { connectDB } from "./configs/database.js";

const PORT = process.env.PORT ?? "5000";
const app = express();

app.use(express.json());

await connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.error("Error in connecting with the database! : ", error);
  });

app.get("/health", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "API is active...",
  });
});
