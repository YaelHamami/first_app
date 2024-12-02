import { commentModel } from "../models/comments_model";

export const createComment = async (req: any, res: any) => {
    const commentBody = req.body;
    try {
        const post = await commentModel.create(commentBody);
        res.status(201).send(post);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};
