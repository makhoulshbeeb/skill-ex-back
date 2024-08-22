import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            enum: ["Web Development", "Data Science", "Cybersecurity", "Artificial Intelligence", "Mobile App Development", "Arts & Crafts", "Business & Entrepreneurship", "Personal Development", "Health & Wellness", "Languages", "Music & Performing Arts", "Cooking & Culinary Arts", "Writing & Literature", "Science & Engineering", "Marketing & Sales", "Design & Creative", "Finance & Investing", "Photography & Videography", "Public Speaking & Communication", "Leadership & Management", "Education", "DIY & Home Improvement", "Fitness & Sports", "Mindfulness & Meditation"],
        },
        picture: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;