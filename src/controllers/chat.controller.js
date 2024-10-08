import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const getChats = async (req, res) => {
    try {
        const senderId = req.user._id;

        const chats = await Chat.find({
            participants: { $all: [senderId] },
        }).populate({ path: 'participants', select: 'displayName username email picture', match: { _id: { $ne: senderId } } }).sort({ updatedAt: -1 });

        if (!chats) return res.status(200).json([]);
        res.status(200).json(chats);
    } catch (error) {
        console.log("Error in getChats controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createChat = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [senderId, receiverId],
            });
        }
        res.status(201).json(chat);
    } catch (error) {
        console.log("Error in createChat controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteChat = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!chat) return res.status(404).json([]);

        chat.messages.forEach(async (el) => await Message.findByIdAndDelete(el));

        await Chat.findOneAndDelete({
            participants: { $all: [senderId, receiverId] },
        });

        res.status(204).json({ response: "Chat deleted succefully" });

    } catch (error) {
        console.log("Error in deleteChat controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};