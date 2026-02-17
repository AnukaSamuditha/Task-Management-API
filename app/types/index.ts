import { Optional } from "sequelize";
import { Request } from "express";

export type UserAttributes = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationCode?: number | null;
  emailVerificationExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken?: string;
};

export interface UserCreationAttributes extends Optional<
  UserAttributes,
  | "id"
  | "isEmailVerified"
  | "emailVerificationCode"
  | "emailVerificationExpires"
  | "createdAt"
  | "updatedAt"
> {}

export type DecodedToken = {
  userID: string;
};

export interface AuthRequest extends Request {
  userID?: string;
}

export type TaskAttributes = {
  id: string;
  name: string;
  status: string;
  priority: string;
  time: number;
  userID: string
};

export interface TaskCreationAttributes extends Optional<
  TaskAttributes,
  "id" | "name" | "status" | "priority" | "time" | "userID"
> {}

export enum TaskStatus {
  PENDING = "pending",
  STARTED = "started",
  ONGOING = "ongoing",
  DONE = "done"
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}