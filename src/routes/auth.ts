import express, { Router } from "express";
import {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { validate } from "../middlewares/validationMiddleware";
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schema/authSchemas";

const router: Router = express.Router();

router.post("/register", validate(registerSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email/:token", validate(verifyEmailSchema), verifyEmail);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post( "/reset-password/:token", validate(resetPasswordSchema),resetPassword);

export default router;
