import Message from "../models/message.model.js";
import Conversation from "../models/Conversation.model.js";
import User from "../models/user.model.js";

const socketHandler = async (data, ws, connectedUsers) => {
  const { type, payload } = data;
  const userId = ws.userId;

  switch (type) {
    // ✅ 1. Send Message
    case "send-message": {
      const { conversationId, text, receiverId } = payload;

      const receiver = await User.findById(receiverId);
      const isFollowedByReceiver = receiver.following.includes(userId);

      const message = new Message({
        conversationId,
        sender: userId,
        text,
        randomUserMessage: !isFollowedByReceiver,
      });

      await message.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: Date.now(),
      });

      const receiverSocket = connectedUsers.get(receiverId.toString());
      if (receiverSocket) {
        receiverSocket.send(
          JSON.stringify({
            type: "receive-message",
            payload: { message, conversationId },
          })
        );
      }

      break;
    }

    // ✅ 2. React to Message
    case "message-react": {
      const { messageId, emoji } = payload;

      const message = await Message.findById(messageId);
      if (!message) break;

      const existingReaction = message.reactions?.find(
        (r) => r.user.toString() === userId.toString() && r.emoji === emoji
      );

      if (existingReaction) {
        message.reactions = message.reactions.filter(
          (r) => !(r.user.toString() === userId.toString() && r.emoji === emoji)
        );
      } else {
        message.reactions.push({ user: userId, emoji });
      }

      await message.save();

      const conversation = await Conversation.findById(message.conversationId);
      const members = conversation.members;

      members.forEach((memberId) => {
        const socket = connectedUsers.get(memberId.toString());
        if (socket) {
          socket.send(
            JSON.stringify({
              type: "message-reaction-updated",
              payload: { messageId, reactions: message.reactions },
            })
          );
        }
      });

      break;
    }

    // ✅ 3. Reply to message
    case "message-reply": {
      const { conversationId, text, replyToMessageId, receiverId } = payload;

      const receiver = await User.findById(receiverId);
      const isFollowedByReceiver = receiver.following.includes(userId);

      const message = new Message({
        conversationId,
        sender: userId,
        text,
        replyTo: replyToMessageId,
        randomUserMessage: !isFollowedByReceiver,
      });

      await message.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: Date.now(),
      });

      const receiverSocket = connectedUsers.get(receiverId.toString());
      if (receiverSocket) {
        receiverSocket.send(
          JSON.stringify({
            type: "receive-reply-message",
            payload: { message, conversationId },
          })
        );
      }

      break;
    }

    // ✅ 4. Typing
    case "typing": {
      const { conversationId, receiverId } = payload;
      const socket = connectedUsers.get(receiverId.toString());
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "typing",
            payload: { conversationId, userId },
          })
        );
      }
      break;
    }

    // ✅ 5. Seen message
    case "message-seen": {
      const { messageId, userId: seenBy } = payload;
      const message = await Message.findById(messageId);
      if (message && !message.seenBy.includes(seenBy)) {
        message.seenBy.push(seenBy);
        await message.save();
      }
      break;
    }

    case "update-message": {
      const { messageId, newText } = data;

      if (!newText || !messageId) return;

      const message = await Message.findById(messageId);
      if (!message) return;

      if (message.sender.toString() !== ws.userId) return;

      message.text = newText;
      message.edited = true;
      await message.save();

      const updatedPayload = {
        type: "MESSAGE_UPDATED",
        messageId,
        newText,
        edited: true,
      };

      // Notify all users in the conversation
      const conversationUsers = await getUsersInConversation(
        message.conversationId
      );

      for (const user of conversationUsers) {
        const socket = connectedUsers.get(user.toString());
        if (socket) socket.send(JSON.stringify(updatedPayload));
      }

      break;
    }

    // ✅ 6. Update last seen
    case "update-last-seen": {
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      break;
    }

    // ✅ 7. Delete for me
    case "delete-for-me": {
      const { messageId } = payload;
      // Frontend should hide the message for this user only (can be handled client-side)
      ws.send(
        JSON.stringify({
          type: "delete-for-me",
          payload: { messageId },
        })
      );
      break;
    }

    // ✅ 8. Delete for everyone
    case "delete-for-everyone": {
      const { messageId, conversationId } = payload;
      await Message.findByIdAndDelete(messageId);

      const conversation = await Conversation.findById(conversationId);
      conversation.members.forEach((memberId) => {
        const socket = connectedUsers.get(memberId.toString());
        if (socket) {
          socket.send(
            JSON.stringify({
              type: "delete-for-everyone",
              payload: { messageId },
            })
          );
        }
      });

      break;
    }

    // ✅ 9. Clear chat
    case "clear-chat": {
      const { conversationId } = payload;
      await Message.deleteMany({ conversationId });

      const conversation = await Conversation.findById(conversationId);
      conversation.members.forEach((memberId) => {
        const socket = connectedUsers.get(memberId.toString());
        if (socket) {
          socket.send(
            JSON.stringify({
              type: "chat-cleared",
              payload: { conversationId },
            })
          );
        }
      });

      break;
    }

    default:
      console.warn("❓ Unknown WS event type:", type);
  }
};

export default socketHandler;
