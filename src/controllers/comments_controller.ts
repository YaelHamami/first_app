import { Request, Response } from "express";
import { commentModel } from "../models/comments_model";
import { postModel } from "../models/posts_model";

// Get All Comments, Or By Post Id
export const getAllComments = async (req: Request, res: Response) => {
    try {
        const { postId } = req.query;

        if (postId) {
            const comments = await commentModel.find({ postId });
            res.status(200).json(comments);
        } else {
            const comments = await commentModel.find();
            res.status(200).json(comments);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Comment By Id
export const getCommentById = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    try {
        const comment = await commentModel.findById(commentId);
        if (comment != null) {
            res.status(200).send(comment);
        } else {
            res.status(404).send("Comment not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Create Comment
export const createComment = async (req: Request, res: Response) => {
    const commentBody = req.body;
    try {
        const post = await commentModel.create(commentBody);
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Delete Comment
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const deleteComment = await commentModel.findByIdAndDelete(req.params.id);
        if (!deleteComment) return res.status(404).json({ message: 'Comment not found' });
        res.status(200).json(deleteComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Comment
export const updateComment = async (req: Request, res: Response) => {
    try {
        // Check if the post exists by finding the post ID
        const postExists = await postModel.findById(req.body.postId);
        
        if (!postExists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Update the comment
        const updateComment = await commentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updateComment) return res.status(404).json({ message: 'Comment not found' });
        res.status(200).json(updateComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
