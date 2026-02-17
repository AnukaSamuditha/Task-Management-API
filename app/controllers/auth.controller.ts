import User from "../models/user.js";
import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/index.js";
import { generateVerificationCode } from "../utils/generateOTP.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: "Missing required information",
      });
    }

    const validationResult = registerSchema.safeParse({
      fullName,
      email,
      password,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Data validation failed",
        details: validationResult.error,
      });
    }

    const existingUser = await User.findOne({
      where: { email: validationResult.data.email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    const verificationCode = generateVerificationCode();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      validationResult.data.password,
      salt,
    );

    const newUser = await User.create({
      fullName: validationResult.data.fullName,
      email: validationResult.data.email,
      password: hashedPassword,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: new Date(Date.now() + 1000 * 60 * 15),
    });

    await sendEmail({
      email: validationResult.data.email,
      otp: verificationCode,
    });

    const { password: userPassword, ...userResponse } = newUser.get({
      plain: true,
    });

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in creating the user",
      details: error,
    });
  }
};

const confirmVerificationCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Missing required information",
      });
    }

    const user = await User.findOne({
      where: {
        emailVerificationCode: code,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    if (
      user.dataValues.emailVerificationExpires &&
      user.dataValues.emailVerificationExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    await user.update({
      isEmailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
    });

    res.status(200).json({
      message: `${user.dataValues.email} email is verified successfully`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in verifying email address",
      details: error,
    });
  }
};

const resendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Missing required information",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.dataValues.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const verificationCode = generateVerificationCode();

    await user.update({
      emailVerificationCode: verificationCode,
      emailVerificationExpires: new Date(Date.now() + 1000 * 60 * 15),
    });

    await sendEmail({ email: user.dataValues.email, otp: verificationCode });

    res.status(200).json({
      message: "Verification code is sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in resending verification code",
      details: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required information",
      });
    }

    const validationResult = loginSchema.safeParse({
      email,
      password,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Login data validation failed",
        details: validationResult.error,
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        error: "Invalid credentials",
      });
    }

    const isPasswordMatching = await bcrypt.compare(
      validationResult.data.password,
      user.dataValues.password,
    );

    if (!isPasswordMatching) {
      return res.status(404).json({
        error: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user.dataValues.id);
    const refreshToken = generateRefreshToken(user.dataValues.id);

    await user.update({
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successfull",
      user: {
        id: user.dataValues.id,
        fullName: user.dataValues.fullName,
        email: user.dataValues.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while login in!",
      details: error,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const userID = (req as any).userID;
    const refreshToken = req.cookies.refreshToken;

    if (!userID || !refreshToken) {
      return res.status(400).json({
        error: "Invalid request!",
      });
    }

    const user = await User.findOne({
      where: { id: userID },
    });

    if (!user || !user.dataValues.refreshToken) {
      return res.status(404).json({
        message: "Refresh token not found!",
      });
    }

    if (user.dataValues.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user.dataValues.id);
	const newRefreshToken = generateRefreshToken(user.dataValues.id);

	await user.update({
		refreshToken: newRefreshToken
	})

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
    });

  } catch (error) {
    res.status(500).json({
      error: "Error occurred while login in!",
      details: error,
    });
  }
};

export {
  createUser,
  confirmVerificationCode,
  resendVerificationCode,
  loginUser,
  refreshToken
};
