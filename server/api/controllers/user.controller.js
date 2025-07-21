import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "../config/email.js";
import { generateTokens } from "../config/generateToken.js";
import crypto from "crypto";
import {connectedUsers} from "../config/websocket.js"

//// ----------------- AUTH CONTROLLERS ----------------- ////

export const registerUser = async (req, res) => {
  try {
    const { password, email, name} = req.body;

    if (!password || !email || !name) {
      res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      res
        .status(401)
        .json({
          success: false,
          message: "Password must be at leadt 6 characters",
        });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      res.status(401).json({ success: false, message: "User already exist" });
    }

    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email,
      password,
      verifytoken: verifyToken,
      verifytokenexpire: Date.now() + 1 * 60 * 60 * 1000,
    });

    await newUser.save();

    await sendEmail(
      newUser.email,
      "Verify your email",
      VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verifyToken)
    );

    res.status(201).json({ success: true, message: "Verify your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({
      verifytoken: code,
      verifytokenexpire: { $gt: Date.now() },
    }).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }
    user.verified = true;
    user.verifytoken = undefined;
    user.verifytokenexpire = undefined;

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Email verified successfully",
        accessToken,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password"); // FIXED

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "Logged out" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const randomToken = crypto.randomBytes(20).toString("hex");

    user.resetpasswordtoken = randomToken;
    user.resetpasswordtokenexpire = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      "Reset your password",
      PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        `${process.env.CLIENT_URL}/reset-password/${randomToken}`
      )
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Reset password link sent to your email",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    const user = await User.findOne({
      resetpasswordtoken: token,
      resetpasswordtokenexpire: { $gt: Date.now() },
    }).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    user.password = password;
    user.resetpasswordtoken = undefined;
    user.resetpasswordtokenexpire = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({data: user});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//// ----------------- PROFILE CONTROLLER ------------------- ////

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, bio, avatar, socialLinks } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        socialLinks: user.socialLinks,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const sendFollowRequest = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser)
      return res.status(404).json({ message: "User not found" });

    if (currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    if (targetUser.followRequests.includes(currentUser._id)) {
      return res.status(400).json({ message: "Follow request already sent" });
    }

    targetUser.followRequests.push(currentUser._id);
    await targetUser.save();

    // 👇 Realtime notification
    const targetSocket = connectedUsers.get(targetUser._id.toString());
    if (targetSocket) {
      targetSocket.send(JSON.stringify({
        type: "follow-request-received",
        fromUser: {
          _id: currentUser._id,
          username: currentUser.username,
          profilePic: currentUser.profilePic
        }
      }));
    }

    res.status(200).json({ message: "Follow request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptFollowRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requesterId = req.params.id;

    if (!currentUser.followRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No such follow request" });
    }

    currentUser.followers.push(requesterId);
    currentUser.followRequests = currentUser.followRequests.filter(
      (id) => id.toString() !== requesterId
    );

    const requester = await User.findById(requesterId);
    requester.following.push(currentUser._id);

    await currentUser.save();
    await requester.save();

    res.status(200).json({ message: "Follow request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);
    if (!isFollowing) {
      return res.status(400).json({ message: "You're not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    // ✅ Real-time Unfollow Notification (if target user online)
    const socket = connectedUsers.get(targetUserId.toString());
    if (socket) {
      socket.send(JSON.stringify({
        type: "unfollowed",
        payload: {
          fromUser: {
            _id: currentUser._id,
            username: currentUser.username,
            name: currentUser.name
          }
        }
      }));
    }

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id; // From protectRoute middleware

    // Prevent user from blocking themselves
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "You can't block yourself." });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark user as blocked
    targetUser.isBlocked = true;
    await targetUser.save();

    res.status(200).json({ message: 'User has been blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
