import express from 'express';
import usersController from "../controllers/users_controller";
import { authMiddleware } from '../controllers/auth_controller';
export const usersRouter = express.Router();

// Delete User By ID
usersRouter.delete('/:id', authMiddleware, usersController.delete.bind(usersController));

// Get All Posts, or all posts published by a sender if provided
usersRouter.get('/', authMiddleware, usersController.getAll.bind(usersController));

// Update User By ID
usersRouter.put('/:id', authMiddleware, usersController.update.bind(usersController));

// Get User By ID
usersRouter.get('/:id', authMiddleware, usersController.getById.bind(usersController));
