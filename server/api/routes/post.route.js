import express from "express";
import multer from "multer";

const upload = multer();
const router = express.Router();

import {
    createPost,
    getPosts,
    deletePost,
    updatePost,
    getPostBySlug
} from "../controllers/post.controller.js";

import {protectRoute} from "../middleware/protectRoute.js";

//// ---------------------- POST ROUTES --------------------------- ////

router.post("/create-post", protectRoute,upload.single("coverImage"), createPost);
router.get("/get-posts", getPosts);
router.get("/get-post-by-slug/:slug", getPostBySlug);
router.delete("/delete-post/:postId", protectRoute, deletePost);
router.put("/update-post/:postId", protectRoute, updatePost);

export default router;