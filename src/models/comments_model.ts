import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post', 
      required: true 
    },
    content: String,
    owner: {
      type: String,
      required: true,
    },
  });

  export const commentModel = mongoose.model("Comments", commentSchema);