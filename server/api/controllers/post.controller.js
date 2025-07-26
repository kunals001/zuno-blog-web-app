import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import slugify from "slugify";
import { connectedUsers } from "../config/websocket.js";
import { processPostImages } from "../utils/processPostImages.js";

export const createPost = async (req, res) => {
  try {
    const { title, description, tags, category, keywords, status } = req.body;
    const content = req.body.content;
    const coverImage = req.file; 

    if (!title || !description || !content) {
      return res
        .status(400)
        .json({ message: "Title, description, and content are required." });
    }

    const userId = req.user;
    const user = await User.findById(userId).populate("followers", "_id");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    
    const { coverImageURL, updatedContent } = await processPostImages(
      coverImage,
      content
    );

    const words = updatedContent.trim().split(/\s+/).length;
    const estimatedReadTime = Math.ceil(words / 200);

    if(status === "Published"){
      await Post.create({
        author: userId,
        title,
        description,
        content: updatedContent,
        slug,
        tags,
        category,
        keywords,
        coverImage: coverImageURL,
        status: "Published",
        readTime: estimatedReadTime,
      });
    }else{
      await Post.create({
        author: userId,
        title,
        description,
        content: updatedContent,
        slug,
        tags,
        category,
        keywords,
        coverImage: coverImageURL,
        status: "Draft",
        isDraft: true,
        readTime: estimatedReadTime,
      });
    }



    await User.findByIdAndUpdate(userId, { $push: { myposts: newPost._id } });

    const notificationData = {
      type: "NEW_POST",
      payload: {
        authorId: userId,
        postId: newPost._id,
        title: newPost.title,
        slug: newPost.slug,
        createdAt: newPost.createdAt,
      },
    };

    user.followers.forEach((follower) => {
      const followerId = follower._id.toString();
      const ws = connectedUsers.get(followerId);
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify(notificationData));
      }
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Post Creation Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email") // author ka naam aur email include karega
      .sort({ createdAt: -1 }); // latest posts first

    res.status(200).json({
      success: true,
      total: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching posts",
    });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }).populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the post",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    // Remove post from user's myposts array
    await User.findByIdAndUpdate(userId, {
      $pull: { myposts: postId },
    });

    res.status(200).json({
      message: "Post deleted successfully",
      deleted: true,
    });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    const {
      title,
      description,
      content,
      tags,
      category,
      keywords,
      coverImage,
      status,
      isFeatured,
    } = req.body;

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }

    // Update only allowed fields (slug will remain unchanged)
    if (title) post.title = title;
    if (description) post.description = description;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (category) post.category = category;
    if (keywords) post.keywords = keywords;
    if (coverImage) post.coverImage = coverImage;
    if (status) post.status = status;
    if (typeof isFeatured === "boolean") post.isFeatured = isFeatured;

    // Update read time only if content is changed
    if (content) {
      const words = content.trim().split(/\s+/).length;
      post.readTime = Math.ceil(words / 200);
    }

    post.updatedAt = new Date();

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      updated: true,
      post,
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
