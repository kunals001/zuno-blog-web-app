import express from "express";
import multer from "multer";

const upload = multer();
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
    blockUser
} from "../controllers/user.controller.js";

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

router.put("/update-profile",protectRoute,upload.single("profilePic"),updateProfile);
router.post('/:id/follow-request', protectRoute, sendFollowRequest);
router.post('/:id/accept-follow', protectRoute, acceptFollowRequest);
router.post('/:id/unfollow', protectRoute, unfollowUser);
router.post('/:id/block', protectRoute, blockUser);

export default router;