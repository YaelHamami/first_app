import { Request, Response } from "express";
import { IPost, postModel } from "../models/posts_model";
import BaseController from "./base_controller";


class PostsController extends BaseController<IPost> {
    constructor() {
        super(postModel);
    }
    
    // getAllPostsOrBySender
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { sender } = req.query;

            if (sender) {
                const posts = await postModel.find({ owner: sender });
                res.status(200).json(posts);
            } else {
                const posts = await postModel.find();
                res.status(200).json(posts);
            }
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    }

    // TODO: override create ?
}

export default new PostsController();