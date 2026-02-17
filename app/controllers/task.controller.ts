import { Request, Response } from "express";
import Task from "../models/task.model.js";
import { AuthRequest } from "../types/index.js";
import { taskCreateSchema, taskUpdateSchema } from "../schemas/index.js";

const createTask = async (req: Request, res: Response) => {
  try {
    const { name, status, priority, time } = req.body;

    const validationResult = taskCreateSchema.safeParse({
      name,
      status,
      priority,
      time,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Data validation failed",
        details: validationResult.error,
      });
    }

    const userID = (req as AuthRequest).userID;

    if (!userID) {
      return res.status(401).json({
        error: "Unauthorized request!",
      });
    }

    const newTask = await Task.create({
      name,
      status,
      priority,
      time,
      userID,
    });

    res.status(201).json({
      message: "Task is created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in creating the task",
      details: error,
    });
  }
};

const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Missing required information",
      });
    }

    const userID = (req as AuthRequest).userID;

    if (!userID) {
      return res.status(401).json({
        error: "Unauthorized request!",
      });
    }

    const task = await Task.findOne({
      where: {
        id,
        userID,
      },
    });

    if (!task) {
      return res.status(404).json({
        error: "Task not found!",
      });
    }

    res.status(200).json({
      task,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in finding the task",
      details: error,
    });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status, priority, time } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Missing required information",
      });
    }

    const userID = (req as AuthRequest).userID;

    if (!userID) {
      return res.status(401).json({
        error: "Unauthorized request!",
      });
    }

    const validationResult = taskUpdateSchema.safeParse({
      name,
      status,
      priority,
      time,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Data validation failed",
        details: validationResult.error,
      });
    }

    const updateData = validationResult.data;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "At least one field must be provided for update",
      });
    }

    const task = await Task.findOne({
      where: {
        id,
        userID,
      },
    });

    if (!task) {
      return res.status(404).json({
        error: "Task not found!",
      });
    }

    await task.update(updateData);

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in updating the task",
      details: error,
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Missing required information",
      });
    }

    const userID = (req as AuthRequest).userID;

    if (!userID) {
      return res.status(401).json({
        error: "Unauthorized request!",
      });
    }

    const task = await Task.findOne({
      where: {
        id,
        userID,
      },
    });

    if (!task) {
      return res.status(404).json({
        error: "Task not found!",
      });
    }

    await task.destroy();

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in deleting the task",
      details: error,
    });
  }
};

const getUserTasks = async (req: Request, res: Response) => {
  try {
    const userID = (req as AuthRequest).userID;

    if (!userID) {
      return res.status(401).json({
        error: "Unauthorized request!",
      });
    }

    const tasks = await Task.findAll({
      where: { userID },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in finding user tasks",
      details: error,
    });
  }
};

export { createTask, getTask, updateTask, deleteTask, getUserTasks };
