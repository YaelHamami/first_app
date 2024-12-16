import express from 'express';
import { getPostById, createPost, updatePost, getAllPostsOrBySender } from "../controllers/posts_controller";
export const postsRouter = express.Router();

// Get Post By ID
postsRouter.get('/:id', getPostById);

// Create Post
postsRouter.post("/", createPost);

// Update Post By ID
postsRouter.put('/:id', updatePost.bind(updatePost));

// Get All Posts, or all posts published by a sender if provided
postsRouter.get('/', getAllPostsOrBySender.bind(getAllPostsOrBySender));
