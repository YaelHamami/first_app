import express from 'express';
import { createComment, getAllComments, deleteComment, getCommentById, updateComment } from "../controllers/comments_controller";
export const commentsRouter = express.Router();

// Get All Comments, Or By PostId
commentsRouter.get('/', getAllComments);

// Get Comment By Id
commentsRouter.get('/:id', getCommentById);

// Create Comment
commentsRouter.post("/", createComment);

// Delete Comment By ID
commentsRouter.delete('/:id', deleteComment.bind(deleteComment));

// Update Comment By ID
commentsRouter.put('/:id', updateComment.bind(updateComment));