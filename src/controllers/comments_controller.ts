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

export const getCommentById = async (req: any, res: any) => {
    const commentId = req.params.id;
    try {
        const comment = await commentModel.findById(commentId);
        if (comment != null) {
            res.status(200).send(comment);
        } else {
            res.status(404).send("Comment not found");
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const getCommentsByPostId = async (req: any, res: any) => {
    const postId = req.params.postId;

    try {
        const comments = await commentModel.find({ postId });
        if (comments != null) {
            res.status(200).send(comments);
        } else {
            res.status(404).send(`Comments of postId: ${postId} , were not found`);
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};