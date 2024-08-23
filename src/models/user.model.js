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
            pattern: "^[A-Za-z][A-Za-z0-9_]{7,29}$",
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
        avgRating: {
            type: Number,
            min: 1,
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
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Category",
                }
            ],
            default: [],
        },
        teach: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Category",
                }
            ],
            default: [],
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;