import { WebSocketServer } from "ws";
import socketHandler from "../sockets/socketHandler.js";
import { verifyUserFromSocket } from "../utils/verifyUser.js";

export const connectedUsers = new Map(); 

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
    const user = await verifyUserFromSocket(req);

    if (!user) {
      ws.close();
      return;
    }

    const userId = user._id.toString();
    ws.userId = userId;
    connectedUsers.set(userId, ws);

    console.log("✅ WebSocket connected:", userId);

    ws.on("message", (data) => {
      try {
        const parsed = JSON.parse(data);
        socketHandler(parsed, ws, connectedUsers);
      } catch (err) {
        console.error("❌ Invalid WS message", err.message);
      }
    });

    ws.on("close", () => {
      connectedUsers.delete(userId);
      console.log("❌ WebSocket disconnected:", userId);
    });
  });

  console.log("✅ WebSocket server initialized");
}
