import express from "express";
const router = express.Router();

import {
    createMessage,
    getMessages,
    updateMessage,
    replyMessage,
    addReaction,
    deleteMessage
} from "../controllers/message.controller.js";

import {protectRoute} from "../middleware/protectRoute.js";

router.post("/message-reply",protectRoute,replyMessage);
router.post("/react",protectRoute,addReaction);
router.post("/create-message", protectRoute, createMessage);
router.get("/get-messages/:conversationId", protectRoute,getMessages);
router.put("/update-message/:messageId", protectRoute, updateMessage);
router.delete("/delete-message/:messageId", protectRoute, deleteMessage);
router.delete("/clear-chat/:conversationId", protectRoute, clearChat);

export default router;