import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  content: {
    type: String,
    required: true
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null 
  },

  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },

  isEdited: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;