import express from 'express';
import usersController from "../controllers/users_controller";
export const usersRouter = express.Router();

// Delete User By ID
usersRouter.delete('/:id', usersController.delete.bind(usersController));

