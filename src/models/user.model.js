import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: (email) => validator.isEmail(email),
                message: "Please provide a valid email",
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"],
        },
        picture: {
            type: String,
            default: "",
        },
        reviews: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Review",
                },
            ],
            default: [],
        },
        learn: {
            type: [
                {
                    type: String,
                    required: true,
                    enum: ["Web Development", "Data Science", "Cybersecurity", "Artificial Intelligence", "Mobile App Development", "Arts & Crafts", "Business & Entrepreneurship", "Personal Development", "Health & Wellness", "Languages", "Music & Performing Arts", "Cooking & Culinary Arts", "Writing & Literature", "Science & Engineering", "Marketing & Sales", "Design & Creative", "Finance & Investing", "Photography & Videography", "Public Speaking & Communication", "Leadership & Management", "Education", "DIY & Home Improvement", "Fitness & Sports", "Mindfulness & Meditation"],
                }
            ],
            default: [],
        },
        teach: {
            type: [
                {
                    type: String,
                    required: true,
                    enum: ["Web Development", "Data Science", "Cybersecurity", "Artificial Intelligence", "Mobile App Development", "Arts & Crafts", "Business & Entrepreneurship", "Personal Development", "Health & Wellness", "Languages", "Music & Performing Arts", "Cooking & Culinary Arts", "Writing & Literature", "Science & Engineering", "Marketing & Sales", "Design & Creative", "Finance & Investing", "Photography & Videography", "Public Speaking & Communication", "Leadership & Management", "Education", "DIY & Home Improvement", "Fitness & Sports", "Mindfulness & Meditation"],
                }
            ],
            default: [],
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;