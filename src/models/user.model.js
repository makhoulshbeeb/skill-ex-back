import mongoose from "mongoose";
import validator from "validator";

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
            validate: {
                validator: (username) => { return /^[a-zA-Z0-9_]+$/.test(username) },
                message: "Please provide a valid username",
            },
            minlength: 4,
            maxlength: 24,
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
        bio: {
            type: String,
            default: "",
        },
        avgRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
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
                    category: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Category"
                    },
                    endorsements: {
                        type: Number,
                        default: 0
                    },
                    _id: false,
                },

            ],
            default: [],
        },
        teach: {
            type: [
                {
                    category: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Category"
                    },
                    _id: false,
                }
            ],
            default: [],
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;