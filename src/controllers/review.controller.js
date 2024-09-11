import User from "../models/user.model.js";
import Review from "../models/review.model.js";

export const addReview = async (req, res) => {
    try {
        const { feedback, rating } = req.body;
        const { id: receiverId } = req.params;
        const reviewerId = req.user._id;

        const receiver = await User.findById(receiverId).select("-password").populate('reviews');
        const review = await Review.findOne({ reviewerId, receiverId });

        const newReview = new Review({
            reviewerId,
            receiverId,
            feedback,
            rating,
        });

        if (newReview) {
            if (review) {
                receiver.avgRating = receiver.reviews.length > 1 ? (receiver.avgRating * (receiver.reviews.length) - review.rating) / (receiver.reviews.length - 1) : 0;
                receiver.reviews = receiver.reviews.filter(el => el._id == review._id);
                await Review.findByIdAndDelete(review._id);
            }
            receiver.avgRating = (receiver.avgRating * receiver.reviews.length + rating) / (receiver.reviews.length + 1);
            receiver.reviews.push(newReview);
        }

        await newReview.save();

        await receiver.save();

        res.status(201).json(newReview);

    } catch (error) {
        console.log("Error in addReview controller: ", error.message);
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
            const receiver = await User.findById(receiverId);
            receiver.avgRating = receiver.reviews.length > 1 ? (receiver.avgRating * (receiver.reviews.length) - review.rating) / (receiver.reviews.length - 1) : 0;
            receiver.reviews = receiver.reviews.filter((el) => {
                if (el == reviewId) {
                    return false;
                }
                return true;
            })
            await receiver.save();
            await Review.findByIdAndDelete(reviewId);
            return res.status(204).json({ response: "Review deleted succefully" });
        }
        res.status(401).json({ response: "Unauthorized" });

    } catch (error) {
        console.log("Error in deleteReview controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};