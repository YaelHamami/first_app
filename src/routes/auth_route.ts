import express from 'express';
import { authMiddleware, login, logout, refreshToken, register } from "../controllers/auth_controller";
export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login)
authRouter.post("/refreshToken", refreshToken);
authRouter.post('/logout', logout)