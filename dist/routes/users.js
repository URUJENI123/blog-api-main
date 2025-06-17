"use strict";
// src/routes/users.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersControllers_1 = require("../controllers/usersControllers");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authorize_1 = require("../middlewares/authorize");
const userSchema_1 = require("../schema/userSchema");
const router = express_1.default.Router();
router.get("/search", (0, validationMiddleware_1.validate)(userSchema_1.searchUsersSchema), usersControllers_1.search);
router.get("/:id", (0, validationMiddleware_1.validate)(userSchema_1.getUserByIdSchema), usersControllers_1.getById);
router.get("/", (0, authorize_1.authorize)(["admin"]), usersControllers_1.getAllUsers);
router.get("/", (0, authorize_1.authorize)(["admin"]), (0, validationMiddleware_1.validate)(userSchema_1.updateUserSchema), usersControllers_1.updateUser); // only admin can update user
router.put("/:id", (0, authorize_1.authorize)(["admin"]), (0, validationMiddleware_1.validate)(userSchema_1.updateUserSchema), usersControllers_1.updateUser);
router.delete("/:id", (0, authorize_1.authorize)(["admin"]), (0, validationMiddleware_1.validate)(userSchema_1.deleteUserSchema), usersControllers_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map