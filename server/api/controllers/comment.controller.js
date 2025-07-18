import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

export const createComment = async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    const userId = req.user._id; // Make sure user is authenticated via middleware

    
    if (!content || !postId) {
      return res.status(400).json({ message: "Post ID and content are required." });
    }

   
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    
    const newComment = new Comment({
      post: postId,
      author: userId,
      content,
      parentComment: parentCommentId || null
    });

    await newComment.save();

   
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (parent) {
        parent.replies.push(newComment._id);
        await parent.save();
      }
    }

    return res.status(201).json({
      message: "Comment created successfully.",
      comment: newComment
    });

  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate("author", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "author",
          select: "name avatar"
        }
      })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Only author or admin can delete
    if (comment.author.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized to delete this comment." });
    }

    // If comment is a reply, remove it from parent's replies[]
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
    }

    // Delete all nested replies recursively (optional: for now skip)
    // await Comment.deleteMany({ parentComment: comment._id });

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error." });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment content cannot be empty." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Sirf comment ka author hi edit kar sake
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this comment." });
    }

    comment.content = content;
    comment.updatedAt = new Date();
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully.", comment });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: "Server error." });
  }
};