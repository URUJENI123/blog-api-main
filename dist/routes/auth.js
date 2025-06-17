"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authSchemas_1 = require("../schema/authSchemas");
const router = express_1.default.Router();
router.post("/register", (0, validationMiddleware_1.validate)(authSchemas_1.registerSchema), authController_1.signup);
router.post("/login", (0, validationMiddleware_1.validate)(authSchemas_1.loginSchema), authController_1.login);
router.get("/verify-email/:token", (0, validationMiddleware_1.validate)(authSchemas_1.verifyEmailSchema), authController_1.verifyEmail);
router.post("/forgot-password", (0, validationMiddleware_1.validate)(authSchemas_1.forgotPasswordSchema), authController_1.forgotPassword);
router.post("/reset-password/:token", (0, validationMiddleware_1.validate)(authSchemas_1.resetPasswordSchema), authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map