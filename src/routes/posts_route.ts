import express from 'express';
import postsController from "../controllers/posts_controller";

export const postsRouter = express.Router();

// Get All Posts, or all posts published by a sender if provided
postsRouter.get('/', postsController.getAll.bind(postsController));

// Get Post By ID
postsRouter.get('/:id', postsController.getById.bind(postsController));

// Create Post
postsRouter.post("/", postsController.create.bind(postsController));

// Update Post By ID
postsRouter.put('/:id', postsController.update.bind(postsController));

