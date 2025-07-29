
import express from "express";
const router = express.Router();

import {
  SearchUser,
  SearchPost,
  getSearchHistory,
  clearSearchHistoryItem,
  clearAllSearchHistory,
  getSearchSuggestions
} from "../controllers/search.controller.js";

import { protectRoute } from "../middleware/protectRoute.js"; 

// Search routes - No authentication required for basic search
router.get("/search/user", SearchUser);
router.get("/search/post", SearchPost);
router.get("/search/suggestions", getSearchSuggestions);

// Search history routes (require authentication)
router.get("/search/history", protectRoute, getSearchHistory);
router.delete("/search/history/:historyId", protectRoute, clearSearchHistoryItem);
router.delete("/search/history", protectRoute, clearAllSearchHistory);

export default router;