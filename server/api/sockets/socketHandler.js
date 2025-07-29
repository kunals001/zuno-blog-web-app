import Message from "../models/message.model.js";
import Conversation from "../models/Conversation.model.js";
import User from "../models/user.model.js";

// Helper function to get users in conversation
const getUsersInConversation = async (conversationId) => {
  const conversation = await Conversation.findById(conversationId).select('members');
  return conversation ? conversation.members : [];
};

const socketHandler = async (data, ws, connectedUsers) => {
  const { type, payload } = data;
  const userId = ws.userId;

  try {
    switch (type) {
      // ✅ 1. Send Message (Text/Image/Video)
      case "send-message": {
        const { conversationId, text, receiverId, messageType = "text", mediaUrl = null } = payload;

        const receiver = await User.findById(receiverId);
        if (!receiver) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Receiver not found" }
          }));
          break;
        }

        const isFollowedByReceiver = receiver.following.includes(userId);

        const message = new Message({
          conversationId,
          sender: userId,
          text: text || "",
          messageType, // "text", "image", "video"
          mediaUrl, // URL for image/video
          randomUserMessage: !isFollowedByReceiver,
        });

        await message.save();

        // Populate sender info for response
        await message.populate('sender', 'username name profilePic');

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

        // Send confirmation back to sender
        ws.send(JSON.stringify({
          type: "message-sent",
          payload: { message, conversationId }
        }));

        break;
      }

      // ✅ 2. React to Message
      case "message-react": {
        const { messageId, emoji } = payload;

        const message = await Message.findById(messageId);
        if (!message) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Message not found" }
          }));
          break;
        }

        const existingReactionIndex = message.reactions?.findIndex(
          (r) => r.user.toString() === userId.toString() && r.emoji === emoji
        );

        if (existingReactionIndex > -1) {
          // Remove reaction
          message.reactions.splice(existingReactionIndex, 1);
        } else {
          // Add reaction
          if (!message.reactions) message.reactions = [];
          message.reactions.push({ user: userId, emoji });
        }

        await message.save();

        const conversation = await Conversation.findById(message.conversationId);
        const members = conversation.members;

        // Notify all conversation members
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
        const { conversationId, text, replyToMessageId, receiverId, messageType = "text", mediaUrl = null } = payload;

        const receiver = await User.findById(receiverId);
        if (!receiver) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Receiver not found" }
          }));
          break;
        }

        const isFollowedByReceiver = receiver.following.includes(userId);

        const message = new Message({
          conversationId,
          sender: userId,
          text: text || "",
          replyTo: replyToMessageId,
          messageType,
          mediaUrl,
          randomUserMessage: !isFollowedByReceiver,
        });

        await message.save();
        await message.populate('sender', 'username name profilePic');
        await message.populate('replyTo', 'text sender messageType mediaUrl');

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

      // ✅ 4. Typing Indicator
      case "typing": {
        const { conversationId, receiverId, isTyping = true } = payload;
        const socket = connectedUsers.get(receiverId.toString());
        if (socket) {
          socket.send(
            JSON.stringify({
              type: "typing",
              payload: { conversationId, userId, isTyping },
            })
          );
        }
        break;
      }

      // ✅ 5. Stop Typing
      case "stop-typing": {
        const { conversationId, receiverId } = payload;
        const socket = connectedUsers.get(receiverId.toString());
        if (socket) {
          socket.send(
            JSON.stringify({
              type: "typing",
              payload: { conversationId, userId, isTyping: false },
            })
          );
        }
        break;
      }

      // ✅ 6. Message Seen
      case "message-seen": {
        const { messageId, userId: seenBy } = payload;
        const message = await Message.findById(messageId);
        if (message && !message.seenBy.includes(seenBy)) {
          message.seenBy.push(seenBy);
          await message.save();

          // Notify sender that message was seen
          const senderSocket = connectedUsers.get(message.sender.toString());
          if (senderSocket) {
            senderSocket.send(JSON.stringify({
              type: "message-seen-update",
              payload: { messageId, seenBy }
            }));
          }
        }
        break;
      }

      // ✅ 7. Update Message
      case "update-message": {
        const { messageId, newText } = payload;

        if (!newText || !messageId) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Message ID and new text required" }
          }));
          return;
        }

        const message = await Message.findById(messageId);
        if (!message) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Message not found" }
          }));
          return;
        }

        if (message.sender.toString() !== userId) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Not authorized to edit this message" }
          }));
          return;
        }

        message.text = newText;
        message.edited = true;
        message.editedAt = new Date();
        await message.save();

        const updatedPayload = {
          type: "message-updated",
          payload: {
            messageId,
            newText,
            edited: true,
            editedAt: message.editedAt
          }
        };

        // Notify all users in the conversation
        const conversationUsers = await getUsersInConversation(message.conversationId);

        for (const user of conversationUsers) {
          const socket = connectedUsers.get(user.toString());
          if (socket) socket.send(JSON.stringify(updatedPayload));
        }

        break;
      }

      // ✅ 8. Update Last Seen
      case "update-last-seen": {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        break;
      }

      // ✅ 9. Delete for Me
      case "delete-for-me": {
        const { messageId } = payload;
        ws.send(
          JSON.stringify({
            type: "delete-for-me",
            payload: { messageId, userId },
          })
        );
        break;
      }

      // ✅ 10. Delete for Everyone
      case "delete-for-everyone": {
        const { messageId, conversationId } = payload;
        
        const message = await Message.findById(messageId);
        if (!message) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Message not found" }
          }));
          break;
        }

        if (message.sender.toString() !== userId) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Not authorized to delete this message" }
          }));
          break;
        }

        await Message.findByIdAndDelete(messageId);

        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.members.forEach((memberId) => {
            const socket = connectedUsers.get(memberId.toString());
            if (socket) {
              socket.send(
                JSON.stringify({
                  type: "message-deleted",
                  payload: { messageId },
                })
              );
            }
          });
        }

        break;
      }

      // ✅ 11. Clear Chat
      case "clear-chat": {
        const { conversationId } = payload;
        
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.members.includes(userId)) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Not authorized to clear this chat" }
          }));
          break;
        }

        await Message.deleteMany({ conversationId });

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

      // ✅ 12. Follow Request
      case "follow-request": {
        const { targetUserId } = payload;
        
        const currentUser = await User.findById(userId).select('username name profilePic');
        const targetUser = await User.findById(targetUserId);

        if (!targetUser || !currentUser) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "User not found" }
          }));
          break;
        }

        if (currentUser.following?.includes(targetUserId)) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Already following this user" }
          }));
          break;
        }

        if (targetUser.followRequests?.includes(userId)) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Follow request already sent" }
          }));
          break;
        }

        // Add follow request
        targetUser.followRequests.push(userId);
        await targetUser.save();

        const socket = connectedUsers.get(targetUserId.toString());
        if (socket) {
          socket.send(
            JSON.stringify({
              type: "follow-request-received",
              payload: { 
                fromUser: {
                  _id: currentUser._id,
                  username: currentUser.username,
                  name: currentUser.name,
                  profilePic: currentUser.profilePic
                }
              },
            })
          );
        }

        // Confirm to sender
        ws.send(JSON.stringify({
          type: "follow-request-sent",
          payload: { targetUserId }
        }));

        break;
      }

      // ✅ 13. Accept Follow Request
      case "accept-follow-request": {
        const { requesterId } = payload;

        const currentUser = await User.findById(userId);
        const requester = await User.findById(requesterId).select('username name profilePic');

        if (!currentUser.followRequests?.includes(requesterId)) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "No such follow request" }
          }));
          break;
        }

        // Add to followers/following
        currentUser.followers.push(requesterId);
        currentUser.followRequests = currentUser.followRequests.filter(
          (id) => id.toString() !== requesterId
        );

        requester.following.push(userId);

        await currentUser.save();
        await requester.save();

        // Notify requester
        const requesterSocket = connectedUsers.get(requesterId.toString());
        if (requesterSocket) {
          requesterSocket.send(JSON.stringify({
            type: "follow-request-accepted",
            payload: {
              acceptedBy: {
                _id: currentUser._id,
                username: currentUser.username,
                name: currentUser.name,
                profilePic: currentUser.profilePic
              }
            }
          }));
        }

        // Confirm to accepter
        ws.send(JSON.stringify({
          type: "follow-request-accepted-confirm",
          payload: { requesterId }
        }));

        break;
      }

      // ✅ 14. Reject Follow Request
      case "reject-follow-request": {
        const { requesterId } = payload;

        const currentUser = await User.findById(userId);
        
        if (!currentUser.followRequests?.includes(requesterId)) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "No such follow request" }
          }));
          break;
        }

        currentUser.followRequests = currentUser.followRequests.filter(
          (id) => id.toString() !== requesterId
        );
        await currentUser.save();

        // Notify requester (optional)
        const requesterSocket = connectedUsers.get(requesterId.toString());
        if (requesterSocket) {
          requesterSocket.send(JSON.stringify({
            type: "follow-request-rejected",
            payload: { rejectedBy: userId }
          }));
        }

        break;
      }

      // ✅ 15. Unfollow User
      case "unfollow": {
        const { targetUserId } = payload;

        const currentUser = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "User not found" }
          }));
          break;
        }

        const isFollowing = currentUser.following?.includes(targetUserId);
        if (!isFollowing) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "You're not following this user" }
          }));
          break;
        }

        // Remove from following/followers
        currentUser.following = currentUser.following.filter(
          (id) => id.toString() !== targetUserId
        );

        targetUser.followers = targetUser.followers.filter(
          (id) => id.toString() !== userId
        );

        await currentUser.save();
        await targetUser.save();

        // Notify target user
        const socket = connectedUsers.get(targetUserId.toString());
        if (socket) {
          socket.send(JSON.stringify({
            type: "unfollowed",
            payload: {
              fromUser: {
                _id: currentUser._id,
                username: currentUser.username,
                name: currentUser.name,
                profilePic: currentUser.profilePic
              }
            }
          }));
        }

        // Confirm to unfollower
        ws.send(JSON.stringify({
          type: "unfollowed-confirm",
          payload: { targetUserId }
        }));

        break;
      }

      // ✅ 16. New Post Notification
      case "new-post": {
        const { authorId, postId, title, slug, createdAt } = payload;

        // Fetch followers of the author
        const author = await User.findById(authorId).select("followers");
        if (!author) break;

        // Notify each follower if connected
        for (const followerId of author.followers) {
          const followerSocket = connectedUsers.get(followerId.toString());
          if (followerSocket) {
            followerSocket.send(
              JSON.stringify({
                type: "new-post-notification",
                payload: {
                  authorId,
                  postId,
                  title,
                  slug,
                  createdAt,
                },
              })
            );
          }
        }

        break;
      }

      // ✅ 17. User Online Status
      case "user-online": {
        // User is already marked online when they connect
        // Broadcast to followers that user is online
        const user = await User.findById(userId).select('followers');
        
        user.followers.forEach(followerId => {
          const followerSocket = connectedUsers.get(followerId.toString());
          if (followerSocket) {
            followerSocket.send(JSON.stringify({
              type: "user-status-update",
              payload: {
                userId,
                status: "online"
              }
            }));
          }
        });

        break;
      }

      default:
        console.warn("❓ Unknown WS event type:", type);
        ws.send(JSON.stringify({
          type: "error",
          payload: { message: `Unknown event type: ${type}` }
        }));
    }
  } catch (error) {
    console.error("❌ Socket handler error:", error);
    ws.send(JSON.stringify({
      type: "error",
      payload: { message: "Internal server error" }
    }));
  }
};

export default socketHandler;