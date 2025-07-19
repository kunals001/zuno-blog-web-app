import "dotenv/config";
import express from 'express';
import http from 'http';
import { initWebSocket } from "./config/websocket.js";
import cookieparser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from "./config/connectDB.js";

const PORT = process.env.PORT || 3000;
connectDB();

const app = express();
const server = http.createServer(app); 

app.use(express.json());
app.use(cookieparser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

import userRoutes from "./routes/user.route.js";
import commentRoutes from "./routes/comment.route.js";

app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);


initWebSocket(server); 


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
