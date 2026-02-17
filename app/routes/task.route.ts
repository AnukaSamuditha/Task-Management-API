import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { createTask, deleteTask, getTask, getUserTasks, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.get("/",authenticate, getUserTasks);
router.post("/",authenticate, createTask)
router.get("/:id",authenticate, getTask);
router.patch("/:id", authenticate, updateTask);
router.delete("/:id",authenticate, deleteTask)

export default router;