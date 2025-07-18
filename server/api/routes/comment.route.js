import express from "express";
const router = express.Router();

import {
    createComment,
    getComments,
    deleteComment,
    updateComment
} from "../controllers/comment.controller.js";

import {protectRoute} from "../middleware/protectRoute.js";

router.post("/create-comment/:postId", protectRoute, createComment);
router.put("/update-comment/:commentId", protectRoute, updateComment);
router.get("/get-comments/:postId", protectRoute, getComments);
router.delete("/delete-comment/:commentId", protectRoute, deleteComment);

export default router;