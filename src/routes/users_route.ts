import express from 'express';
import usersController from "../controllers/users_controller";
import { authMiddleware } from '../controllers/auth_controller';
export const usersRouter = express.Router();

// Delete User By ID
usersRouter.delete('/:id', authMiddleware, usersController.delete.bind(usersController));

