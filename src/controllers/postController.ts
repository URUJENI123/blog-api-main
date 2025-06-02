import { Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import {
  CreatePost,
  GetPostById,
  DeletePost,
  UpdatePost,
} from "../schema/postSchema";
import { AuthenticatedRequest, ApiResponse } from "../types/commonTypes";
import { PostService } from "../services/PostServices";
import { NotFoundError, ForbiddenError } from "../utils/errors";

const postService = new PostService();

export const createPost = asyncHandler(
  async (
    req: AuthenticatedRequest & CreatePost,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new ForbiddenError("You must be logged in to create a post");
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
  }
);

export const getAllPosts = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const posts = await postService.findAll();

    res.json({
      success: true,
      message: "Posts retrieved successfully",
      data: { posts, count: posts.length },
    });
  }
);

export const getPostById = asyncHandler(
  async (
    req: AuthenticatedRequest & GetPostById,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { id } = req.params;

    const post = await postService.findById(id);
    if (!post) {
      throw new NotFoundError("Post");
    }

    res.json({
      success: true,
      message: "Post retrieved successfully",
      data: { post },
    });
  }
);

export const updatePost = asyncHandler(
  async (
    req: AuthenticatedRequest & UpdatePost,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ForbiddenError("You must be logged in to update a post");
    }

    // Check if post exists
    const existingPost = await postService.findByIdWithUser(id);
    if (!existingPost) {
      throw new NotFoundError("Post");
    }

    // Check if user is the author of the post
    if (existingPost.user?.id !== userId) {
      throw new ForbiddenError("You can only update your own posts");
    }

    const updatedPost = await postService.update(id, { title, content });

    res.json({
      success: true,
      message: "Post updated successfully",
      data: { post: updatedPost },
    });
  }
);

export const deletePost = asyncHandler(
  async (
    req: AuthenticatedRequest & DeletePost,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new ForbiddenError("You must be logged in to delete a post");
    }

    // Check if post exists
    const existingPost = await postService.findByIdWithUser(id);
    if (!existingPost) {
      throw new NotFoundError("Post");
    }

    // Check if user is the author of the post
    if (existingPost.user?.id !== userId) {
      throw new ForbiddenError("You can only delete your own posts");
    }

    const deleted = await postService.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete post");
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  }
);
