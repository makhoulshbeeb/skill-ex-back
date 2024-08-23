import express from "express";
import { deleteReview, getReviews, addReview } from "../controllers/review.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/:id", userAuth, getReviews);
router.post("/:id", userAuth, addReview);
router.delete("/:id", userAuth, deleteReview)

export default router;