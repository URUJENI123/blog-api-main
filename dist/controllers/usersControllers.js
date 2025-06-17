"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getById = exports.search = exports.getAllUsers = void 0;
const UserServices_1 = require("../services/UserServices");
const errorHandler_1 = require("../middlewares/errorHandler");
const errors_1 = require("../utils/errors");
const userService = new UserServices_1.UserService();
exports.getAllUsers = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const users = await userService.findAll();
    res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: { users }
    });
});
exports.search = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { name } = req.query;
    const users = name ? await userService.findByName(name) : [];
    res.json({
        success: true,
        message: 'Search completed successfully',
        data: { users, count: users.length }
    });
});
exports.getById = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const user = await userService.findById(id);
    if (!user) {
        throw new errors_1.NotFoundError('User');
    }
    res.json({
        success: true,
        message: 'User retrieved successfully',
        data: { user }
    });
});
exports.updateUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    // Check if user exists
    const existingUser = await userService.findById(id);
    if (!existingUser) {
        throw new errors_1.NotFoundError('User');
    }
    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
        const userWithEmail = await userService.findByEmail(updateData.email);
        if (userWithEmail) {
            throw new errors_1.ConflictError('Email is already in use');
        }
    }
    const updatedUser = await userService.update(id, updateData);
    res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser }
    });
});
exports.deleteUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const user = await userService.findById(id);
    if (!user) {
        throw new errors_1.NotFoundError('User');
    }
    const deleted = await userService.delete(id);
    if (!deleted) {
        throw new Error('Failed to delete user');
    }
    res.json({
        success: true,
        message: 'User deleted successfully'
    });
});
//# sourceMappingURL=usersControllers.js.map