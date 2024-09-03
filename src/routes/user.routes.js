import express from "express";
import userAuth from "../middleware/userAuth.js";
import { deleteUser, editUser, getUserByToken, getUserByUsername, getUsersByMatch, getUsersBySearch } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user/:username", getUserByUsername);
router.get("/me", userAuth, getUserByToken)
router.get("/search/:search", userAuth, getUsersBySearch);
router.get("/match/", userAuth, getUsersByMatch);
router.patch("/", userAuth, editUser);
router.delete("/", userAuth, deleteUser);

export default router;