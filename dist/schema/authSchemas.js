"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const commonSchemas_1 = require("./commonSchemas");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: commonSchemas_1.nameSchema,
        email: commonSchemas_1.emailSchema,
        password: commonSchemas_1.passwordSchema,
        role: zod_1.z.enum(["user", "admin"]).default("user"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: commonSchemas_1.emailSchema,
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: commonSchemas_1.emailSchema,
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token is required"),
    }),
    body: zod_1.z.object({
        newPassword: commonSchemas_1.passwordSchema,
    }),
});
exports.verifyEmailSchema = zod_1.z.object({
    params: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token is required"),
    }),
});
//# sourceMappingURL=authSchemas.js.map