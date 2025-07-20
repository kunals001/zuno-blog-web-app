import Message from "../models/message.model.js";
import Conversation from "../models/Conversation.model.js";
import User from "../models/user.model.js";

export const createMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user._id;

    const conversation = await Conversation.findById(conversationId).populate("members");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const receiverId = conversation.members.find(member => member.toString() !== senderId);
    const sender = await User.findById(senderId);
    // const receiver = await User.findById(receiverId);

    const isFollowing = sender.following.includes(receiverId);

    const message = new Message({
      conversationId,
      sender: senderId,
      text,
      randomUserMessage: !isFollowing
    });

    await message.save();

    // Update conversation with last message
    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    // 🔥 Emit real-time message to receiver via WebSocket
    const io = req.app.get("io");
    io.to(receiverId.toString()).emit("newMessage", {
      ...message.toObject(),
      randomUserMessage: !isFollowing,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("createMessage error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const user = req.user._id;
    if(!user) return res.status(404).json({ message: "User not found" });
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { messageId, emoji } = req.body;
    const userId = req.user._id;

    if (!messageId || !emoji) {
      return res.status(400).json({ error: "messageId and emoji are required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user already reacted with same emoji
    const existingReaction = message.reactions.find(
      (reaction) => reaction.user.toString() === userId.toString() && reaction.emoji === emoji
    );

    if (existingReaction) {
      // Remove the reaction (toggle off)
      message.reactions = message.reactions.filter(
        (reaction) => !(reaction.user.toString() === userId.toString() && reaction.emoji === emoji)
      );
    } else {
      // Add new reaction
      message.reactions.push({ user: userId, emoji });
    }

    await message.save();

    // (Optional) WebSocket event emit here if needed

    res.status(200).json({ success: true, message: "Reaction updated", reactions: message.reactions });
  } catch (error) {
    console.error("addReaction error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const replyMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { conversationId, text, replyTo, receiverId } = req.body;

    if (!conversationId || !text || !replyTo || !receiverId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    const isFollowedByReceiver = receiver.following.includes(senderId);

    const message = await Message.create({
      conversationId,
      sender: senderId,
      text,
      replyTo,
      randomUserMessage: !isFollowedByReceiver,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Reply Message Error:", error);
    res.status(500).json({ error: "Server error while sending reply." });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { forEveryone } = req.query;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    const isSender = message.sender.toString() === userId.toString();

    if (forEveryone === "true") {
      if (!isSender) {
        return res
          .status(403)
          .json({ error: "Only sender can delete for everyone" });
      }

      await Message.findByIdAndDelete(messageId);
      return res.json({ message: "Deleted for everyone" });
    } else {
      // Delete just for current user (mark as deleted for that user)
      if (!message.deletedFor) message.deletedFor = [];
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }

      return res.json({ message: "Deleted for you" });
    }
  } catch (err) {
    console.error("deleteMessage error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const clearChat = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({ conversationId });

    for (const msg of messages) {
      // Skip if already deleted for this user
      if (!msg.deletedFor) msg.deletedFor = [];

      if (!msg.deletedFor.includes(userId)) {
        msg.deletedFor.push(userId);
        await msg.save();
      }
    }

    res.json({ message: "Chat cleared for you" });
  } catch (err) {
    console.error("clearChat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { newText } = req.body;
    const userId = req.user._id;

    if (!newText || newText.trim() === "") {
      return res.status(400).json({ error: "Message text cannot be empty." });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only edit your own messages." });
    }

    message.text = newText;
    message.edited = true;
    await message.save();

    res.json({ message: "Message updated successfully.", updatedMessage: message });
  } catch (err) {
    console.error("updateMessage error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};