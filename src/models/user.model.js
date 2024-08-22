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