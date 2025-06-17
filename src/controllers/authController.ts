import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserServices";

import { generateJWT, generateResetToken, generateVerifyToken } from "../utils/jwt";
import { sendResetPasswordEmail, sendVerificationEmail } from "../utils/email";
  import { asyncHandler } from "../middlewares/errorHandler";
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../schema/authSchemas";

import { ApiResponse, AuthenticatedRequest } from "../types/commonTypes";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "../utils/errors";



const authService = new AuthService();
const userService = new UserService();



export const signup = asyncHandler(
  async (
    req: AuthenticatedRequest & RegisterInput,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { name, email, password, role } = req.body;

    const existingUser = await userService.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const newUser = await authService.create({ name, email, password,role });
    const token = generateVerifyToken({ userId: newUser.id, email: newUser.email });
    const verifyLink = `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;
    await sendVerificationEmail(newUser.email, verifyLink);


    res.status(201).json({
      success: true,
      message:
        "User created successfully. Please check your email and verify your account.",
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  }
) as RequestHandler;

//Verify email
export const verifyEmail = asyncHandler(
  async (
    req: AuthenticatedRequest & VerifyEmailInput,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { token } = req.params;

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const user = await userService.findById(payload.userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    if (user.isEmailVerified) {
      throw new ConflictError("Email is already verified");
    }

    await userService.update(user.id, { isEmailVerified: true });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  }
);

//Login
export const login = asyncHandler(async (
    req: AuthenticatedRequest & LoginInput,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    const user = await userService.login(email, password);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenError("Please verify your email before logging in");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Your account has been deactivated");
    }

    const token = generateJWT(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  }
);

//forgot Password
export const forgotPassword = asyncHandler(
  async (
    req: AuthenticatedRequest & ForgotPasswordInput,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { email } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User");
    }

    const Token = generateResetToken(user.email);
    const resetLink = `${process.env.RESET_PASSWORD_URL}/${Token}`;

    await sendResetPasswordEmail(email, resetLink);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  }
);

// Reset Password
export const resetPassword = asyncHandler(
  async (
    req: AuthenticatedRequest & ResetPasswordInput,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
    };
    const user = await userService.findByEmail(decoded.email);

    if (!user) {
      throw new NotFoundError("User");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.update(user.id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  }
);
