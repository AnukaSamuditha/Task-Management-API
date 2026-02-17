import { Request, Response } from "express";
import { AuthRequest } from "../types/index.js";
import User from "../models/user.model.js";

const self = async (req: Request, res: Response) => {
  try {
    const userID = (req as AuthRequest).userID;

    if (!userID) {
      return res.status(400).json({
        error: "No user ID found!",
      });
    }

    const user = await User.findByPk(userID);

    if (!user) {
      return res.status(404).json({
        message: "Invalid user id",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Error getting user info",
      error: err.message,
    });
  }
};

export { self };
