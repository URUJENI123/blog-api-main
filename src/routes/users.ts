// src/routes/users.ts

import express, { Router } from "express";
import {
  getAllUsers,
  search,
  getById,
  updateUser,
  deleteUser,
} from "../controllers/usersControllers";

const router: Router = express.Router();

// GET all users
router.get("/", getAllUsers);

// GET /users/search
router.get("/search", search);

// GET user by ID
router.get("/:id", getById);

// PUT update user
router.put("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);

export default router;
