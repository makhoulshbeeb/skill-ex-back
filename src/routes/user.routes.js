import express from "express";
import userAuth from "../middleware/userAuth.js";
import { deleteUser, editUser, getUserByUsername, getUsersByMatch, getUsersBySearch } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:username", getUserByUsername);
router.get("/search/:search", getUsersBySearch);
router.get("/match/", getUsersByMatch);
router.patch("/", userAuth, editUser);
router.delete("/", userAuth, deleteUser);

export default router;