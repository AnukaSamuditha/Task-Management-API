import express from "express";
import {
  confirmVerificationCode,
  createUser,
  resendVerificationCode,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/verify", confirmVerificationCode);
router.post("/code", resendVerificationCode);

export default router;
