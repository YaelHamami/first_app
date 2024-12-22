import express from 'express';
import postsController from "../controllers/posts_controller";
import { authMiddleware } from '../controllers/auth_controller';

export const postsRouter = express.Router();

// Get All Posts, or all posts published by a sender if provided
postsRouter.get('/', authMiddleware, postsController.getAll.bind(postsController));

// Get Post By ID
postsRouter.get('/:id', authMiddleware, postsController.getById.bind(postsController));

// Create Post
postsRouter.post("/", authMiddleware, postsController.create.bind(postsController));

// Update Post By ID
postsRouter.put('/:id', authMiddleware, postsController.update.bind(postsController));

