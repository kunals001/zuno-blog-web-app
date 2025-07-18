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
    acceptFollowRequest
} from "../controllers/user.controller.js";

import {protectRoute} from "../middleware/protectRoute.js";


//// ---------------------- AUTH ROUTES --------------------------- ////

router.post("/checkauth", protectRoute,checkAuth);
router.post("/register", registerUser);
router.post("/verifyemail",verifyUser)
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:resettoken", resetPassword);

//// ---------------------- PROFILE ROUTES --------------------------- ////

router.post("/update-profile",protectRoute,updateProfile);
router.post('/user/:id/follow-request', protectRoute, sendFollowRequest);
router.post('/user/:id/accept-follow', protectRoute, acceptFollowRequest);


export default router;