import { Request, Response } from "express";
import {userModel, IUser} from "../models/users_model";
import BaseController from "./base_controller";
import { authenticatedRequest } from "./base_controller";
import { postModel } from "../models/posts_model";


class UsersController extends BaseController<IUser> {
    constructor() {
        super(userModel);
    }

    async getAll(req: Request, res: Response) {
        try {
            const users = await userModel.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

        async delete(req: authenticatedRequest, res: Response) {
            try {
                const userId = req.params.id // User id
                await super.delete(req, res, userId) 
            } catch (err: any) {
                res.status(500).json({ error: err.message });
            }
        };
}

export default new UsersController();