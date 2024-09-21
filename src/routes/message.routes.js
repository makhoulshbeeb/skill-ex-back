import express from "express";
import userAuth from "../middleware/userAuth.js";
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", userAuth, getMessages);
router.post("/send/:id", userAuth, sendMessage);
router.delete("/:id", userAuth, deleteMessage);

export default router;