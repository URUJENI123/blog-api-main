import { User } from "../entities/User";
import { Token, TokenType } from "../entities/Token";
import { UserRepository } from "../repositories/UserRepository";
import { AppDataSource } from "../config/db";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const tokenRepository = AppDataSource.getRepository(Token);

export class AuthService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configure your email service here
    //   host: process.env.EMAIL_HOST || "smtp.example.com",
    //   port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "user@example.com",
        pass: process.env.EMAIL_PASS || "password",
      },
    });
  }

  async generateToken(
    user: User,
    type: TokenType,
    expiresInMinutes = 60
  ): Promise<Token> {
    const tokenString = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const token = tokenRepository.create({
      user,
      userId: user.id,
      token: tokenString,
      type,
      expiresAt,
      used: false,
    });

    return tokenRepository.save(token);
  }

  async sendVerificationEmail(user: User, token: Token): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token.token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      to: user.email,
      subject: "Verify your email",
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(user: User, token: Token): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token.token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      to: user.email,
      subject: "Reset your password",
      text: `You can reset your password by clicking the following link: ${resetUrl}`,
      html: `<p>You can reset your password by clicking the following link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async verifyToken(
    tokenString: string,
    type: TokenType
  ): Promise<Token | null> {
    const token = await tokenRepository.findOne({
      where: { token: tokenString, type, used: false },
      relations: ["user"],
    });

    if (!token) return null;
    if (token.expiresAt < new Date()) return null;

    return token;
  }

  async markTokenUsed(token: Token): Promise<void> {
    token.used = true;
    await tokenRepository.save(token);
  }

  async resetPassword(
    tokenString: string,
    newPassword: string
  ): Promise<boolean> {
    const token = await this.verifyToken(tokenString, TokenType.PASSWORD_RESET);
    if (!token) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserRepository.updateUser(token.userId, { password: hashedPassword });

    await this.markTokenUsed(token);
    return true;
  }
}
