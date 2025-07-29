import { WebSocketServer } from "ws";
import socketHandler from "../sockets/socketHandler.js";
import { verifyUserFromSocket } from "../utils/verifyUser.js";
import User from "../models/user.model.js";

export const connectedUsers = new Map(); 

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
    const user = await verifyUserFromSocket(req);

    if (!user) {
      ws.close(1008, "Authentication failed");
      return;
    }

    const userId = user._id.toString();
    ws.userId = userId;
    
    // Store connection
    connectedUsers.set(userId, ws);

    // Update user's last seen and online status
    await User.findByIdAndUpdate(userId, { 
      lastSeen: new Date(),
      isOnline: true 
    });

    console.log("✅ WebSocket connected:", userId);

    // Notify followers that user is online
    const currentUser = await User.findById(userId).select('followers');
    currentUser.followers.forEach(followerId => {
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

    // Send connection confirmation
    ws.send(JSON.stringify({
      type: "connection-established",
      payload: {
        userId,
        timestamp: new Date().toISOString()
      }
    }));

    // Handle incoming messages
    ws.on("message", (data) => {
      try {
        const parsed = JSON.parse(data);
        socketHandler(parsed, ws, connectedUsers);
      } catch (err) {
        console.error("❌ Invalid WS message", err.message);
        ws.send(JSON.stringify({
          type: "error",
          payload: { message: "Invalid message format" }
        }));
      }
    });

    // Handle connection close
    ws.on("close", async () => {
      connectedUsers.delete(userId);
      
      // Update user's offline status
      await User.findByIdAndUpdate(userId, { 
        lastSeen: new Date(),
        isOnline: false 
      });

      // Notify followers that user is offline
      if (currentUser) {
        currentUser.followers.forEach(followerId => {
          const followerSocket = connectedUsers.get(followerId.toString());
          if (followerSocket) {
            followerSocket.send(JSON.stringify({
              type: "user-status-update",
              payload: {
                userId,
                status: "offline",
                lastSeen: new Date().toISOString()
              }
            }));
          }
        });
      }

      console.log("❌ WebSocket disconnected:", userId);
    });

    // Handle connection errors
    ws.on("error", (error) => {
      console.error("❌ WebSocket error for user", userId, ":", error);
    });

    // Ping-pong for connection health
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
  });

  // Heartbeat to check connection health
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // Check every 30 seconds

  wss.on('close', () => {
    clearInterval(interval);
  });

  console.log("✅ WebSocket server initialized");
}

// Helper function to broadcast to all connected users
export const broadcastToAll = (message) => {
  connectedUsers.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
};

// Helper function to broadcast to specific users
export const broadcastToUsers = (userIds, message) => {
  userIds.forEach(userId => {
    const socket = connectedUsers.get(userId.toString());
    if (socket && socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  });
};