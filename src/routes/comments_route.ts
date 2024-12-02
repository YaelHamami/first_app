import express from 'express';
import { getAllComments, getCommentById } from '../controllers/comments_controller';
export const commentsRouter = express.Router();

// Get All Comments
commentsRouter.get('/', getAllComments);

// Get Post By ID
commentsRouter.get('/:id', getCommentById);