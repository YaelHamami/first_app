import express from 'express';
import { createComment } from "../controllers/comments_controller";
export const commentRoutes = express.Router();

// Create Post
commentRoutes.post("/", createComment);