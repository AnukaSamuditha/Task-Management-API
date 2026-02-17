import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../types/index.js";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized request",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as DecodedToken;

    (req as any).userID = decodedToken.userID;

    next();
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while authenticating the request",
      details: error,
    });
  }
};

const validateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Unauthorized request, no refresh token provided",
      });
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as DecodedToken;

    (req as any).userID = decodedToken.userID;

    next();
  } catch (error) {
    res.status(500).json({
      error: "Refresh token authentication failed",
      details: error,
    });
  }
};

export { authenticate, validateRefreshToken };
