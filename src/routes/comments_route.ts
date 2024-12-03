import express from 'express';
import { createComment } from "../controllers/comments_controller";
export const commentRoutes = express.Router();

// Create Comment
commentRoutes.post("/", createComment);