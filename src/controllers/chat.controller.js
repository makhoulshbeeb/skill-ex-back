import Chat from "../models/chat.model.js";

export const getChats = async (req, res) => {
    try {
        const senderId = req.user._id;

        const chats = await Chat.find({
            participants: { $all: [senderId] },
        });

        if (!chats) return res.status(200).json([]);

        res.status(200).json(chats);
    } catch (error) {
        console.log("Error in getChats controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

