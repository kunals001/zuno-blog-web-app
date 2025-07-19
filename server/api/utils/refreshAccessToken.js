import "dotenv/config";
import jwt from "jsonwebtoken";

export const refreshAccessToken = (req, res) => {
  console.log("🔥 Refresh token route hit");

  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


