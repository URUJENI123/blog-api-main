import { AppDataSource } from "../config/db";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { ForbiddenError, NotFoundError } from "../utils/errors";
import { validateEntity } from "../utils/validate";

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export const getAllPostsService = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  return await postRepository.find({
    where: { user: { user_id: Number(userId) } },
    relations: ["user"],
    order: { createdAt: "DESC" },
    skip: (page - 1) * limit, // Pagination
    take: limit, // Limit the number of posts
  });
};

export const getPostByIdService = async (id: number, userId: string) => {
  const post = await postRepository.findOneOrFail({
    where: { id },
    relations: ["user"],
  });

  if (post.user.user_id !== Number(userId))
    throw new ForbiddenError("Not authorized to view this post");

  return post;
};

export const createPostService = async (
  userId: string,
  title: string,
  content: string
) => {
  const user = await userRepository.findOneBy({ user_id: Number(userId) });
  if (!user) throw new NotFoundError("User not found");

  const post = new Post();
  post.title = title;
  post.content = content;
  post.user = user;

  await validateEntity(post); // Validate before saving
  return await postRepository.save(post);
};

export const updatePostService = async (
  id: number,
  userId: string,
  title?: string,
  content?: string
) => {
  const post = await postRepository.findOneOrFail({
    where: { id },
    relations: ["user"],
  });

  if (post.user.user_id !== Number(userId))
    throw new ForbiddenError("Not authorized");

  if (title) post.title = title;
  if (content) post.content = content;

  await validateEntity(post); // Validate before saving
  return await postRepository.save(post);
};

export const deletePostService = async (id: number, userId: string) => {
  const post = await postRepository.findOneOrFail({
    where: { id },
    relations: ["user"],
  });

  if (post.user.user_id !== Number(userId))
    throw new ForbiddenError("Not authorized");

  await postRepository.remove(post);
  return { message: "Post deleted successfully" };
};
