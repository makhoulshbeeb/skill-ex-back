import express from "express";
import { deleteReview, getReviews, addReview, deleteReviewAdmin } from "../controllers/review.controller.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/:id", getReviews);
router.post("/:id", userAuth, addReview);
router.delete("/:id", userAuth, deleteReview);
router.delete("/admin/:id", adminAuth, deleteReviewAdmin);

export default router;