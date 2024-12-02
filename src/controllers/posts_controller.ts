import { postModel } from "../models/posts_model";

export const getPostById = async (req: any, res: any) => {
    const postId = req.params.id;
    try {
        const post = await postModel.findById(postId);
        if (post != null) {
            res.status(200).send(post);
            } else {
            res.status(404).send("Post not found");
            }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const createPost = async (req: any, res: any) => {
    const postBody = req.body;
    try {
        const post = await postModel.create(postBody);
        res.status(201).send(post);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const updatePost = async (req: any, res: any) => {
    try {
        const updatedPost = await postModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(updatedPost);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};