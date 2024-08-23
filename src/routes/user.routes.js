import express from "express";
import userAuth from "../middleware/userAuth.js";
import { deleteUser, editUser, getUserByUsername, getUsersBySearch } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:username", userAuth, getUserByUsername);
router.get("/search/:search", userAuth, getUsersBySearch);
router.patch("/", userAuth, editUser);
router.delete("/", userAuth, deleteUser)

export default router;