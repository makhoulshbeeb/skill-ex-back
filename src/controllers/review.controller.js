import User from "../models/user.model.js";
import Review from "../models/review.model.js";

export const addReview = async (req, res) => {
    try {
        const { feedback, rating } = req.body;
        const { id: receiverId } = req.params;
        const reviewerId = req.user._id;

        const receiver = await User.findById(receiverId);

        const newReview = {
            reviewerId,
            feedback,
            rating,
            createdAt: new Date(),
        };

        receiver.reviews.push(newReview);

        await receiver.save();
        res.status(201).json(newReview);

        await User.findByIdAndUpdate(receiverId, { $set: { avgRating: { $avg: '$reviews.rating' } } });

    } catch (error) {
        console.log("Error in addReview controller: ", error.review);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { id: receiverId } = req.params;

        const receiver = await User.findById(receiverId);

        if (!receiver) return res.status(200).json([]);

        const reviews = receiver.reviews;

        res.status(200).json(reviews);

    } catch (error) {
        console.log("Error in getReviews controller: ", error.review);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId, receiverId } = req.params;
        const reviewerId = req.user._id;

        const receiver = await User.findById(receiverId);

        if (!receiver) return res.status(404).json([]);

        receiver.reviews = receiver.reviews.filter((review) => {
            if (review.reviewerId.toString() == reviewerId.toString() && review._id.toString() == reviewId.toString()) {
                return false;
            }
            return true;
        });

        await receiver.save();
        res.status(204).json({ response: "Review deleted succefully" });

        await User.findByIdAndUpdate(receiverId, { $set: { avgRating: { $avg: '$reviews.rating' } } });

    } catch (error) {
        console.log("Error in deleteReview controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};