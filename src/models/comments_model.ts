import mongoose from "mongoose";

export interface IComments {
    postId: string;
    comment: string;
    owner: string;
  }

const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true,
    },
});

export const commentModel = mongoose.model<IComments>("Comment", CommentSchema);
