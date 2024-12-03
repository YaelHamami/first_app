import { commentModel } from "../models/comments_model";

// Get All Comments
export const getAllComments = async (req: any, res: any) => {
    try {
        const comments = await commentModel.find();
        res.status(200).json(comments);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Create Comment
export const createComment = async (req: any, res: any) => {
    const commentBody = req.body;
    try {
        const post = await commentModel.create(commentBody);
        res.status(201).send(post);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};
