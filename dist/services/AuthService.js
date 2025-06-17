"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Token_1 = require("../entities/Token");
const db_1 = require("../config/db");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const UserServices_1 = require("./UserServices");
const tokenRepository = db_1.AppDataSource.getRepository(Token_1.Token);
class AuthService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST || "smtp.example.com",
            port: parseInt(process.env.EMAIL_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || "user@example.com",
                pass: process.env.EMAIL_PASS || "password",
            },
        });
        this.userService = new UserServices_1.UserService();
    }
    async create({ name, email, password, role = "USER" }) {
        console.log("Creating user with email", email);
        console.log("Raw password before hashing:", password);
        return await this.userService.create({ name, email, password, role });
    }
    async generateToken(user, type, expiresInMinutes = 60) {
        const tokenString = crypto_1.default.randomBytes(32).toString("hex");
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
    async sendVerificationEmail(user, token) {
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
    async sendResetPasswordEmail(user, token) {
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
    async verifyToken(tokenString, type) {
        const token = await tokenRepository.findOne({
            where: { token: tokenString, type, used: false },
            relations: ["user"],
        });
        if (!token)
            return null;
        if (token.expiresAt < new Date())
            return null;
        return token;
    }
    async markTokenUsed(token) {
        token.used = true;
        await tokenRepository.save(token);
    }
    async resetPassword(tokenString, newPassword) {
        const token = await this.verifyToken(tokenString, Token_1.TokenType.PASSWORD_RESET);
        if (!token)
            return false;
        await this.userService.update(token.userId, { password: newPassword });
        await this.markTokenUsed(token);
        return true;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map