// src/routes/users.ts

import express, { Router } from "express";
import {
  getAllUsers,
  search,
  getById,
  updateUser,
  deleteUser,
} from "../controllers/usersControllers";
import { validate } from "../middlewares/validationMiddleware";
import { authorize } from "../middlewares/authorize";
import {
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
  searchUsersSchema,
} from "../schema/userSchema";

const router: Router = express.Router();

router.get("/search", validate(searchUsersSchema), search);
router.get("/:id", validate(getUserByIdSchema), getById);
router.get("/", authorize(["admin"]), getAllUsers);
router.get("/", authorize(["admin"]), validate(updateUserSchema), updateUser); // only admin can update user
router.put("/:id",authorize(["admin"]),validate(updateUserSchema), updateUser);
router.delete("/:id", authorize(["admin"]), validate(deleteUserSchema), deleteUser);

export default router;
