import { postModel } from "../models/posts_model";

export const createPost = async (req: any, res: any) => {
  const postBody = req.body;
  try {
    const post = await postModel.create(postBody);
    res.status(201).send(post);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};