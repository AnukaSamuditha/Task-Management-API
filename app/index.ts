import express, { Request, Response } from "express";
import { connectDB } from "./configs/database.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import taskRoutes from "./routes/task.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const PORT = process.env.PORT ?? "5000";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_PREFIX,
    credentials: true,
  }),
);
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

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
