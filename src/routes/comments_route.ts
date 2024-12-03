import express from 'express';
import { createComment, getAllComments, deleteComment } from "../controllers/comments_controller";
export const commentsRouter = express.Router();

// Get All Comments
commentsRouter.get('/', getAllComments);

// Create Comment
commentsRouter.post("/", createComment);

// Delete Comment By ID
commentsRouter.delete('/:id', deleteComment);