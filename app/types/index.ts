import { Optional } from "sequelize";

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
  refreshToken?: string
}

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
  userID : string
}
