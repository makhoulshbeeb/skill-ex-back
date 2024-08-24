import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        participants: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            unique: true,
        },
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
                default: [],
            },
        ],
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;