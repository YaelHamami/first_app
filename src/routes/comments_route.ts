import express from 'express';
import { createComment, getCommentById, getAllComments, getCommentsByPostId } from "../controllers/comments_controller";
export const commentsRouter = express.Router();

// Get All Comments
commentsRouter.get('/', getAllComments);

// Get Post By Id
commentsRouter.get('/:id', getCommentById);

// Create Comment
commentsRouter.post("/", createComment);
