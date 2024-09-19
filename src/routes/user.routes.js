import express from "express";
import userAuth from "../middleware/userAuth.js";
import { deleteUser, editUser, endorseUser, getUserById, getUserByToken, getUserByUsername, getUsersByMatch, getUsersBySearch, updateRole } from "../controllers/user.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/user/:username", getUserByUsername);
router.get("/id/:id", getUserById);

router.get("/me", userAuth, getUserByToken);
router.get("/search/:search", userAuth, getUsersBySearch);
router.get("/search/", userAuth, getUsersBySearch);
router.get("/match/", userAuth, getUsersByMatch);
router.patch("/endorse/:id", userAuth, endorseUser);
router.patch("/", userAuth, editUser);
router.delete("/", userAuth, deleteUser);

router.get("/admin", adminAuth, getUserByToken);
router.patch("/role/:id", adminAuth, updateRole);
router.delete("/:id", adminAuth, deleteUser);

export default router;