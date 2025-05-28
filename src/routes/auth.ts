import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController";
import  { errorHandler } from "../middlewares/errorHandler";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", errorHandler, getProfile);

export default router;
