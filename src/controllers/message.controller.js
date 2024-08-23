import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getMessages = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        const chat = await Chat.findOne({
            participants: { $all: [senderId, recieverId] },
        }).populate("messages");

        if (!chat) return res.status(200).json([]);

        const messages = chat.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};