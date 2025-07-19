import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function verifyUserFromSocket(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token"); // ws://localhost:3000?token=ACCESS_TOKEN

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    return user || null;
  } catch (error) {
    console.log("WebSocket Auth Error:", error.message);
    return null;
  }
}
