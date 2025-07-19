import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  keywords: {
    type: [String],
    default: []
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  content: {
    type: String,
    required: true
  },

  coverImage: {
    type: String  // URL to S3 or Cloudinary
  },

  tags: {
    type: [String],
    default: []
  },

  category: {
    type: String,
    default: "General"
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],

  isDraft: {
    type: Boolean,
    default: false
  },

  readTime: {
    type: Number,
    default: 1
  },

  views: {
    type: Number,
    default: 0
  },

  isFeatured: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;