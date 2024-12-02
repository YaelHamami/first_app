import express from 'express';
import { getPostById, createPost, updatePost, getAllPosts } from "../controllers/posts_controller";
export const postsRouter = express.Router();

// Get Post By ID
postsRouter.get('/:id', getPostById);

// Create Post
postsRouter.post("/", createPost);

// Update Post By ID
postsRouter.put('/:id', updatePost);

// Get All Posts
postsRouter.get('/', getAllPosts);
