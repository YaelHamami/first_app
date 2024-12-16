import express from 'express';
import { authMiddleware, login, register } from "../controllers/auth_controller";
export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login)