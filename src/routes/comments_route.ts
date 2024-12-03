import express from 'express';
import { createComment } from "../controllers/comments_controller";
import { getAllComments } from '../controllers/comments_controller';
export const commentsRouter = express.Router();

// Get All Comments
commentsRouter.get('/', getAllComments);

// Create Comment
commentsRouter.post("/", createComment);
