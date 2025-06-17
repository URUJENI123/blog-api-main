"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const PostServices_1 = require("../services/PostServices");
const errors_1 = require("../utils/errors");
const postService = new PostServices_1.PostService();
exports.createPost = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { title, content } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw new errors_1.ForbiddenError("You must be logged in to create a post");
    }
    const newPost = postService.create({
        title,
        content,
        authorId: userId,
    });
    res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: {
            post: {
                id: (await newPost).id,
                title: (await newPost).title,
                content: (await newPost).content,
            },
        },
    });
});
exports.getAllPosts = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const posts = await postService.findAll();
    res.json({
        success: true,
        message: "Posts retrieved successfully",
        data: { posts, count: posts.length },
    });
});
exports.getPostById = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const post = await postService.findById(id);
    if (!post) {
        throw new errors_1.NotFoundError("Post");
    }
    res.json({
        success: true,
        message: "Post retrieved successfully",
        data: { post },
    });
});
exports.updatePost = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw new errors_1.ForbiddenError("You must be logged in to update a post");
    }
    // Check if post exists
    const existingPost = await postService.findByIdWithUser(id);
    if (!existingPost) {
        throw new errors_1.NotFoundError("Post");
    }
    // Check if user is the author of the post
    if (existingPost.user?.id !== userId) {
        throw new errors_1.ForbiddenError("You can only update your own posts");
    }
    const updatedPost = await postService.update(id, { title, content });
    res.json({
        success: true,
        message: "Post updated successfully",
        data: { post: updatedPost },
    });
});
exports.deletePost = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw new errors_1.ForbiddenError("You must be logged in to delete a post");
    }
    // Check if post exists
    const existingPost = await postService.findByIdWithUser(id);
    if (!existingPost) {
        throw new errors_1.NotFoundError("Post");
    }
    // Check if user is the author of the post
    if (existingPost.user?.id !== userId) {
        throw new errors_1.ForbiddenError("You can only delete your own posts");
    }
    const deleted = await postService.delete(id);
    if (!deleted) {
        throw new Error("Failed to delete post");
    }
    res.json({
        success: true,
        message: "Post deleted successfully",
    });
});
//# sourceMappingURL=postController.js.map