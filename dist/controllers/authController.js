"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AuthService_1 = require("../services/AuthService");
const UserServices_1 = require("../services/UserServices");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
const errorHandler_1 = require("../middlewares/errorHandler");
const errors_1 = require("../utils/errors");
const authService = new AuthService_1.AuthService();
const userService = new UserServices_1.UserService();
exports.signup = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
        throw new errors_1.ConflictError("User with this email already exists");
    }
    const newUser = await authService.create({ name, email, password });
    const token = (0, jwt_1.generateVerifyToken)({ userId: newUser.id, email: newUser.email });
    const verifyLink = `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;
    await (0, email_1.sendVerificationEmail)(newUser.email, verifyLink);
    res.status(201).json({
        success: true,
        message: "User created successfully. Please check your email and verify your account.",
        data: {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        },
    });
});
//Verify email
exports.verifyEmail = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { token } = req.params;
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await userService.findById(payload.userId);
    if (!user) {
        throw new errors_1.NotFoundError("User");
    }
    if (user.isEmailVerified) {
        throw new errors_1.ConflictError("Email is already verified");
    }
    await userService.update(user.id, { isEmailVerified: true });
    res.status(200).json({
        success: true,
        message: "Email verified successfully",
    });
});
//Login
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    if (!user) {
        throw new errors_1.UnauthorizedError("Invalid email or password");
    }
    if (!user.isEmailVerified) {
        throw new errors_1.ForbiddenError("Please verify your email before logging in");
    }
    if (!user.isActive) {
        throw new errors_1.ForbiddenError("Your account has been deactivated");
    }
    const token = (0, jwt_1.generateJWT)(user);
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
});
//forgot Password
exports.forgotPassword = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { email } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) {
        throw new errors_1.NotFoundError("User");
    }
    const Token = (0, jwt_1.generateResetToken)(user.email);
    const resetLink = `${process.env.RESET_PASSWORD_URL}/${Token}`;
    await (0, email_1.sendResetPasswordEmail)(email, resetLink);
    res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
    });
});
// Reset Password
exports.resetPassword = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await userService.findByEmail(decoded.email);
    if (!user) {
        throw new errors_1.NotFoundError("User");
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await userService.update(user.id, { password: hashedPassword });
    res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
});
//# sourceMappingURL=authController.js.map