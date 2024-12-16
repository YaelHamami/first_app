import { Request, Response } from "express";
import { commentModel, IComments } from "../models/comments_model";
import BaseController from "./base_controller";
import { postModel } from "../models/posts_model";


class CommentsController extends BaseController<IComments> {
    constructor() {
        super(commentModel);
    }

    // Get All Comments, Or By Post Id
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.query;

            if (postId) {
                const comments = await commentModel.find({ postId });
                res.status(200).json(comments);
            } else {
                const comments = await commentModel.find();
                res.status(200).json(comments);
            }
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
    async update(req: Request, res: Response) {
        try {
            // Check if the post exists by finding the post ID
            const postExists = await postModel.findById(req.body.postId);
            if (!postExists) {
                return res.status(404).json({ message: 'Post not found' });
            }

            super.update(req, res);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    };

}

export default new CommentsController();

