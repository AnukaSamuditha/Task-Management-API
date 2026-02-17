import express from "express";
import {
  confirmVerificationCode,
  createUser,
  loginUser,
  refreshToken,
  resendVerificationCode,
} from "../controllers/auth.controller.js";
import { validateRefreshToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/verify", confirmVerificationCode);
router.post("/code", resendVerificationCode);
router.post("/refresh", validateRefreshToken, refreshToken);

export default router;
