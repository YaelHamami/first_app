import mongoose from 'mongoose';

export interface IPost {
    title: string;
    content: string;
    owner: string;
  }

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
    owner: {
        type: String,
        required: true,
    },
});

export const postModel = mongoose.model<IPost>("Posts", postSchema);