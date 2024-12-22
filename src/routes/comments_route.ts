import express from 'express';
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from '../controllers/auth_controller';
export const commentsRouter = express.Router();

// Get All Comments, Or By PostId
commentsRouter.get('/', authMiddleware, commentsController.getAll.bind(commentsController));

// Get Comment By Id
commentsRouter.get('/:id', authMiddleware, commentsController.getById.bind(commentsController));

// Create Comment
commentsRouter.post("/", authMiddleware, commentsController.create.bind(commentsController));

// Delete Comment By ID
commentsRouter.delete('/:id', authMiddleware, commentsController.delete.bind(commentsController));

// Update Comment By ID
commentsRouter.put('/:id', authMiddleware, commentsController.update.bind(commentsController));
