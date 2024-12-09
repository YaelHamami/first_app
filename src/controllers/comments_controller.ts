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

// Get Comment By Id
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

// Delete Comment
export const deleteComment = async (req: any, res: any) => {
    try {
        const deleteComment = await commentModel.findByIdAndDelete(req.params.id);
        if (!deleteComment) return res.status(404).json({ message: 'Comment not found' });
        res.status(200).json(deleteComment);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};