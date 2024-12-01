import express from 'express';
const app = express();
import { getPostById } from "../controllers/posts_controller";
export const postsRouter = express.Router();

// Get A Post By ID
postsRouter.get('/:id', getPostById);
