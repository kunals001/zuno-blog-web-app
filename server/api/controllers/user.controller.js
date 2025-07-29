import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "../utils/email.js";
import { generateTokens } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { processProfileImage } from "../utils/processProfileImage.js";
import {connectedUsers} from "../config/websocket.js";

export const registerUser = async (req, res) => {
  try {
    const { password, email, name, username } = req.body;

    // 1. Basic required fields check
    if (!password || !email || !name || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 2. Password length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 3. Username format validation (only alphanumeric)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .json({ success: false, message: "Username must be alphanumeric" });
    }

    // 4. Check if username already exists
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // 5. Check if email already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User with this email already exists",
        });
    }

    // 6. Create verification token
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

    // 7. Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      username,
      verificationToken: verifyToken,
      verifyTokenExpiry: Date.now() + 1 * 60 * 60 * 1000, // 1 hour expiry
    });

    // 8. Send verification email
    await sendEmail(
      newUser.email,
      "Verify your email",
      VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verifyToken)
    );

    // 9. Respond
    res.status(201).json({ success: true, message: "Verify your email" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({
      verificationToken: code,
      verifyTokenExpiry: { $gt: Date.now() },
    }).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
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

const generateStrongPassword = (name) => {
  const salt = crypto.randomBytes(4).toString("hex"); // 8 chars
  const namePart = name.slice(0, 3).toLowerCase(); // first 3 letters
  const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number

  return `${namePart}@${salt}${randomNum}`; // final password string
};

const generateUniqueUsername = async (name) => {
  const baseUsername = name.replace(/\s+/g, "").toLowerCase();

  let username;
  let isTaken = true;

  while (isTaken) {
    const randomSuffix = crypto.randomBytes(2).toString("hex"); // 4-digit hex
    username = `${baseUsername}_${randomSuffix}`;

    const existing = await User.findOne({ username });
    if (!existing) {
      isTaken = false;
    }
  }

  return username;
};

export const googleSignup = async (req, res) => {
  try {
    const { name, email, profilePic } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
      const { accessToken, refreshToken } = generateTokens(existUser._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken,
        user: {
          _id: existUser._id,
          name: existUser.name,
          email: existUser.email,
          profilePic: existUser.profilePic,
          username: existUser.username,
        },
      });
    }

    const rawPassword = generateStrongPassword(name);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const username = await generateUniqueUsername(name);

    const newUser = await User.create({
      name,
      email,
      profilePic,
      password: hashedPassword,
      username,
      signupSource: "google",
      isVerified: true,
    });

    const { accessToken, refreshToken } = generateTokens(newUser._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Both fields are required" });
    }

    // Check if identifier is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const user = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    ).select("+password");

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
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
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

    user.forgotPasswordToken = randomToken;
    user.forgotPasswordExpiry = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      "Reset your password",
      PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        `${process.env.CLIENT_URL}/reset-password/${randomToken}`
      )
    );

    res.status(200).json({
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
      forgotPasswordToken: token,
      forgotPasswordExpiry: { $gt: Date.now() },
    }).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

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

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//// ----------------- PROFILE CONTROLLER ------------------- ////

export const updateProfile = async (req, res) => {
  try {
    console.log("=== UPDATE PROFILE START ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const userId = req.user;
    const { name, bio, socialLinks, username, password } = req.body;
    const profilePic = req.file;

    // User find करें
    console.log("Finding user with ID:", userId);
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("Current user profilePic:", user.profilePic);

    // Username update check
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      user.username = username;
    }

    // Profile pic update - सिर्फ file exist करने पर
    if (profilePic) {
      console.log("=== PROFILE PIC UPDATE START ===");
      console.log("File details:", {
        fieldname: profilePic.fieldname,
        originalname: profilePic.originalname,
        mimetype: profilePic.mimetype,
        size: profilePic.size,
        buffer: profilePic.buffer
          ? `Buffer exists (${profilePic.buffer.length} bytes)`
          : "No buffer",
      });

      try {
        // नया function use करें (you need to implement this)
        const result = await processProfileImage(profilePic);
        console.log("processProfileImage result:", result);

        if (result && result.profilePicUrl) {
          user.profilePic = result.profilePicUrl;
          console.log("New profilePic URL set:", user.profilePic);
        } else {
          console.error("No profilePicUrl in result:", result);
          return res.status(500).json({
            success: false,
            message: "Failed to get profile picture URL",
          });
        }
      } catch (imageError) {
        console.error("Image processing error:", imageError);
        return res.status(500).json({
          success: false,
          message: "Failed to process profile picture: " + imageError.message,
        });
      }
      console.log("=== PROFILE PIC UPDATE END ===");
    } else {
      console.log("No profile pic file uploaded, skipping image processing");
    }

    // Other fields update
    if (name !== undefined) {
      user.name = name;
      console.log("Name updated to:", name);
    }

    if (bio !== undefined) {
      user.bio = bio;
      console.log("Bio updated to:", bio);
    }

    if (socialLinks !== undefined) {
      try {
        user.socialLinks =
          typeof socialLinks === "string"
            ? JSON.parse(socialLinks)
            : socialLinks;
        console.log("Social links updated to:", user.socialLinks);
      } catch (parseError) {
        console.error("Error parsing socialLinks:", parseError);
        user.socialLinks = socialLinks; // Use as is if parsing fails
      }
    }

    // Password update
    if (password !== undefined && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      console.log("Password updated");
    }

    // Save user
    console.log("About to save user with profilePic:", user.profilePic);
    const savedUser = await user.save();
    console.log("User saved successfully!");
    console.log("Final saved profilePic:", savedUser.profilePic);

    // 🔥 REAL-TIME: Notify followers about profile update
    const updatedUserInfo = {
      _id: savedUser._id,
      name: savedUser.name,
      username: savedUser.username,
      profilePic: savedUser.profilePic,
      bio: savedUser.bio,
    };

    // Notify all followers
    savedUser.followers.forEach((followerId) => {
      const followerSocket = connectedUsers.get(followerId.toString());
      if (followerSocket) {
        followerSocket.send(
          JSON.stringify({
            type: "user-profile-updated",
            payload: { updatedUser: updatedUserInfo },
          })
        );
      }
    });

    console.log("=== UPDATE PROFILE END ===");

    // Response
    res.status(200).json({ message: "Follow request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectFollowRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user);
    const requesterId = req.params.id;

    if (!currentUser.followRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No such follow request" });
    }

    currentUser.followRequests = currentUser.followRequests.filter(
      (id) => id.toString() !== requesterId
    );
    await currentUser.save();

    // 🔥 REAL-TIME: Notify requester (optional)
    const requesterSocket = connectedUsers.get(requesterId.toString());
    if (requesterSocket) {
      requesterSocket.send(
        JSON.stringify({
          type: "follow-request-rejected",
          payload: { rejectedBy: currentUser._id },
        })
      );
    }

    res.status(200).json({ message: "Follow request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);
    if (!isFollowing) {
      return res
        .status(400)
        .json({ message: "You're not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    // 🔥 REAL-TIME: Notify target user
    const socket = connectedUsers.get(targetUserId.toString());
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "unfollowed",
          payload: {
            fromUser: {
              _id: currentUser._id,
              username: currentUser.username,
              name: currentUser.name,
              profilePic: currentUser.profilePic,
            },
          },
        })
      );
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
    const currentUserId = req.user;

    // Prevent user from blocking themselves
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "You can't block yourself." });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from following/followers if exists
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== targetUserId
    );

    targetUser.following = targetUser.following.filter(
      (id) => id.toString() !== currentUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    // Add to blocked users
    if (!currentUser.blockedUsers) currentUser.blockedUsers = [];
    if (!currentUser.blockedUsers.includes(targetUserId)) {
      currentUser.blockedUsers.push(targetUserId);
    }

    await currentUser.save();
    await targetUser.save();

    // 🔥 REAL-TIME: Notify target user
    const socket = connectedUsers.get(targetUserId.toString());
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "user-blocked",
          payload: {
            blockedBy: currentUserId,
          },
        })
      );
    }

    res.status(200).json({ message: "User has been blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user;

    const currentUser = await User.findById(currentUserId);

    if (
      !currentUser.blockedUsers ||
      !currentUser.blockedUsers.includes(targetUserId)
    ) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (id) => id.toString() !== targetUserId
    );
    await currentUser.save();

    // 🔥 REAL-TIME: Notify target user
    const socket = connectedUsers.get(targetUserId.toString());
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "user-unblocked",
          payload: {
            unblockedBy: currentUserId,
          },
        })
      );
    }

    res.status(200).json({ message: "User has been unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowRequests = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId)
      .populate("followRequests", "username name profilePic createdAt")
      .select("followRequests");

    res.status(200).json({
      success: true,
      followRequests: user.followRequests,
    });
  } catch (error) {
    console.error("Error getting follow requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOnlineUsers = async (req, res) => {
  try {
    const userId = req.user;
    const currentUser = await User.findById(userId).select("following");

    // Get online users from following list
    const onlineFollowing = currentUser.following.filter((followingId) =>
      connectedUsers.has(followingId.toString())
    );

    const onlineUsers = await User.find({
      _id: { $in: onlineFollowing },
    }).select("username name profilePic");

    res.status(200).json({
      success: true,
      onlineUsers: onlineUsers.map((user) => ({
        ...user.toObject(),
        isOnline: true,
      })),
    });
  } catch (error) {
    console.error("Error getting online users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const username = req.params.username;
    const user = await User.findOne({ username })
      .select("-password")
      .populate("followers", "username name profilePic")
      .populate("following", "username name profilePic")
      .populate("followRequests", "username name profilePic")
      .populate(
        "myposts",
        "title description content coverImage likes comments views readTime createdAt"
      );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current user is online
    const isOnline = connectedUsers.has(user._id.toString());

    // Check relationship with current user
    const currentUser = await User.findById(userId);
    const isFollowing = currentUser.following.includes(user._id);
    const isFollower = currentUser.followers.includes(user._id);
    const hasPendingRequest = user.followRequests.some(
      (req) => req._id.toString() === userId
    );

    res.status(200).json({
      user: {
        ...user.toObject(),
        isOnline,
        relationship: {
          isFollowing,
          isFollower,
          hasPendingRequest,
        },
      },
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

export const sendFollowRequest = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);

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

    // 🔥 REAL-TIME: Notify target user
    const targetSocket = connectedUsers.get(targetUser._id.toString());
    if (targetSocket) {
      targetSocket.send(
        JSON.stringify({
          type: "follow-request-received",
          payload: {
            fromUser: {
              _id: currentUser._id,
              username: currentUser.username,
              name: currentUser.name,
              profilePic: currentUser.profilePic,
            },
          },
        })
      );
    }

    res.status(200).json({ message: "Follow request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptFollowRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user);
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

    // 🔥 REAL-TIME: Notify requester
    const requesterSocket = connectedUsers.get(requesterId.toString());
    if (requesterSocket) {
      requesterSocket.send(
        JSON.stringify({
          type: "follow-request-accepted",
          payload: {
            acceptedBy: {
              _id: currentUser._id,
              username: currentUser.username,
              name: currentUser.name,
              profilePic: currentUser.profilePic,
            },
          },
        })
      );
    }

    res.status(200).json({ message: "Follow request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
