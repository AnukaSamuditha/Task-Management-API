import z from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(6)
    .max(50).trim(),
  email: z.email().toLowerCase().trim(),
  password: z
    .string()
    .min(8)
    .max(64),
});