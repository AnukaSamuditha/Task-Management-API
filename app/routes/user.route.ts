import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { self } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/self",authenticate, self);

export default router;