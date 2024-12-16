import { Request, Response } from "express";
import { postModel } from "../models/posts_model";

export const getPostById = async (req: Request, res: Response) => {
    const postId = req.params.id;
    try {
        const post = await postModel.findById(postId);
        if (post != null) {
            res.status(200).send(post);
        } else {
            res.status(404).send("Post not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const createPost = async (req: Request, res: Response) => {
    const postBody = req.body;
    try {
        const post = await postModel.create(postBody);
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const updatedPost = await postModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllPostsOrBySender = async (req: Request, res: Response) => {
    try {
        const { sender } = req.query;

        if (sender) {
            const posts = await postModel.find({ owner: sender });
            res.status(200).json(posts);
        } else {
            const posts = await postModel.find();
            res.status(200).json(posts);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};