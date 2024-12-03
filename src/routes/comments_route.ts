import express from 'express';
import { createComment, getCommentsByPostId } from "../controllers/comments_controller";
import { getAllComments, getCommentById } from '../controllers/comments_controller';
export const commentsRouter = express.Router();

// Get All Comments
commentsRouter.get('/', getAllComments);

// Get Post By Id
commentsRouter.get('/:id', getCommentById);

// Get Post By postId
commentsRouter.get('/:postId', getCommentsByPostId);

// Create Comment
commentsRouter.post("/", createComment);
