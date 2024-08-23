import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addReview = async (req, res) => {
    try {
        const { feedback, rating } = req.body;
        const { id: receiverId } = req.params;
        const reviewerId = req.user._id;

        const receiver = User.findById(receiverId);

        const newReview = new Review({
            reviewerId,
            feedback,
            rating,
        });

        if (newReview) {
            receiver.reviews.push(newReview._id);
        }

        await Promise.all([receiver.save(), newReview.save()]);

        res.status(201).json(newReview);

    } catch (error) {
        console.log("Error in addReview controller: ", error.review);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { id: receiverId } = req.params;

        const receiver = await User.findById(receiverId).populate("reviews");

        if (!receiver) return res.status(200).json([]);

        const reviews = receiver.reviews;

        res.status(200).json(reviews);

    } catch (error) {
        console.log("Error in getReviews controller: ", error.review);
        res.status(500).json({ error: "Internal server error" });
    }
};


