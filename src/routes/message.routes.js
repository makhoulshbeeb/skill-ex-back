import express from "express";
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/:id", userAuth, getMessages);
router.post("/send/:id", userAuth, sendMessage);
router.delete("/:id", userAuth, deleteMessage)

export default router;