import { postModel } from "../models/posts_model";

export const getPostById = async (req: any, res: any) => {
    try {
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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};