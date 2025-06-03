import express from "express";
import userRoutes from "./users";
import postRoutes from "./postRoutes";
import authRoutes from "./auth";


const router = express.Router();

router.use("/users", userRoutes);
router.use('/post', postRoutes);
router.use('/auth', authRoutes);

export default router;
