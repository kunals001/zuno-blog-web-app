import express from "express";
const router = express.Router();

import {
    registerUser,
    verifyUser,
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
router.post("/checkauth", protectRoute,checkAuth);
router.post("/register", registerUser);
router.post("/verifyemail",verifyUser)
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

//// ---------------------- PROFILE ROUTES --------------------------- ////

router.post("/update-profile",protectRoute,updateProfile);
router.post('/:id/follow-request', protectRoute, sendFollowRequest);
router.post('/:id/accept-follow', protectRoute, acceptFollowRequest);
router.post('/:id/unfollow', protectRoute, unfollowUser);
router.post('/:id/block', protectRoute, blockUser);

export default router;