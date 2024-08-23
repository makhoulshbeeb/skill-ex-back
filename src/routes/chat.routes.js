import express from "express";
import userAuth from "../middleware/userAuth.js";
import { createChat, deleteChat, getChats } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", userAuth, getChats);
router.post("/:id", userAuth, createChat);
router.delete("/:id", userAuth, deleteChat)

export default router;