import User from "../models/user.model.js";
import Review from "../models/review.model.js";

export const addReview = async (req, res) => {
    try {
        const { feedback, rating } = req.body;
        const { id: receiverId } = req.params;
        const reviewerId = req.user._id;

        const receiver = await User.findById(receiverId);

        const newReview = new Review({
            reviewerId,
            receiverId,
            feedback,
            rating,
        });

        if (newReview) receiver.reviews.push(newReview._id);

        await Promise.all([receiver.save(), newReview.save()]);

        if (newReview) await User.findByIdAndUpdate(receiverId, { $set: { avgRating: { $avg: '$reviews.rating' } } });

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

export const deleteReview = async (req, res) => {
    try {
        const { id: reviewId } = req.params;
        const reviewerId = req.user._id;

        const review = await Review.findById(reviewId);

        if (!review) return res.status(404).json([]);

        const receiverId = review.receiverId;

        if (review.reviewerId.toString() == reviewerId.toString()) {
            await Review.findByIdAndDelete(reviewId);
            const receiver = await User.findByIdAndUpdate(receiverId, { $pull: { reviews: { $in: [reviewId] } } }, { $set: { avgRating: { $avg: '$reviews.rating' } } });
            return res.status(204).json({ response: "Review deleted succefully" });
        }
        res.status(401).json({ response: "Unauthorized" });

    } catch (error) {
        console.log("Error in deleteReview controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};