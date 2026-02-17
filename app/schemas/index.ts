import z from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(6).max(50).trim(),
  email: z.email().toLowerCase().trim(),
  password: z.string().min(8).max(64),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(64),
});

export const taskCreateSchema = z.object({
  name: z.string().min(3).max(50),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "started", "ongoing", "done"]),
  time: z.number().min(1),
});

export const taskUpdateSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "started", "ongoing", "done"]).optional(),
  time: z.number().min(1).optional(),
});
