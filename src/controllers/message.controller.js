import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
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

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            chat.messages.push(newMessage._id);
        }

        await Promise.all([chat.save(), newMessage.save()]);

        const senderSocketId = getReceiverSocketId(senderId);
        io.to(senderSocketId).emit("newMessage", newMessage);

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        if (!chat) return res.status(200).json([]);

        const messages = chat.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const senderId = req.user._id;

        const message = await Message.findById(messageId);

        if (message.senderId.toString() == senderId.toString()) {
            await Chat.findOneAndUpdate({ participants: { $all: [senderId, message.receiverId] } }, { $pull: { messages: { $in: [messageId] } } });
            await Message.findByIdAndDelete(messageId);
            res.status(204).json({ response: "Message deleted succefully" });
        } else {
            res.status(401).json({ response: "Unauthorized" });
        }

    } catch (error) {
        console.log("Error in deleteMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};