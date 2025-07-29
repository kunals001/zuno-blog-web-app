import express from "express";
import multer from "multer";
const router = express.Router();

import {
    registerUser,
    verifyEmail,
    googleSignup,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    checkAuth,
    updateProfile,
    sendFollowRequest,
    acceptFollowRequest,
    unfollowUser,
    blockUser,
    getUserByUsername,
    unblockUser,
    getFollowRequests,
    getOnlineUsers,
    rejectFollowRequest
} from "../controllers/user.controller.js";

const upload = multer();


import {protectRoute} from "../middleware/protectRoute.js";
import {refreshAccessToken} from "../utils/refreshAccessToken.js";

//// ---------------------- AUTH ROUTES --------------------------- ////

router.get("/refresh", refreshAccessToken);
router.get("/check-auth", protectRoute, checkAuth);
router.post("/register", registerUser);
router.post("/verify", verifyEmail);
router.post("/google-signup", googleSignup);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//// ---------------------- PROFILE ROUTES --------------------------- ////

router.put("/update-profile", protectRoute, upload.single("profilePic"), updateProfile);
router.get("/get-user/:username", protectRoute, getUserByUsername);

// Follow system routes
router.post('/:id/follow-request', protectRoute, sendFollowRequest);
router.post('/:id/accept-follow', protectRoute, acceptFollowRequest);
router.post('/:id/reject-follow', protectRoute, rejectFollowRequest);
router.post('/:id/unfollow', protectRoute, unfollowUser);

// Block system routes
router.post('/:id/block', protectRoute, blockUser);
router.post('/:id/unblock', protectRoute, unblockUser);

// Additional routes
router.get('/follow-requests', protectRoute, getFollowRequests);
router.get('/online-users', protectRoute, getOnlineUsers);

export default router;