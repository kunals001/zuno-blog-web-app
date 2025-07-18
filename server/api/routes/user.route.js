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
} from "../controllers/user.controller.js";

import {protectRoute} from "../middleware/protectRoute.js";

router.post("/checkauth", protectRoute,checkAuth);
router.post("/register", registerUser);
router.post("/verifyemail",verifyUser)
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:resettoken", resetPassword);


export default router;