import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const getUserByToken = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        _id: user._id,
        displayName: user.displayName,
        username: user.username,
        picture: user.picture,
    });
}

export const getUsersBySearch = async (req, res) => {
    try {
        const search = req.params.search;

        const rgx = (pattern) => new RegExp(`.*${pattern}.*`, 'i');
        const searchRgx = rgx(search);

        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId }, $or: [{ displayName: searchRgx }, { username: searchRgx }] }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserByUsername = async (req, res) => {
    try {

        const username = req.params.username;

        const user = await User.findOne({ username }).select("-password").populate("reviews");

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUsersByMatch = async (req, res) => {
    try {
        const learn = req.user.learn;
        const teach = req.user.teach;

        const users = await User.find({ learn: { $in: teach }, teach: { $in: learn } }).select("-password").sort({ rating: 1 });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const editUser = async (req, res) => {

    try {
        const id = req.user._id;
        const { displayName, email, username, gender, picture, learn, teach } = req.body;

        const user = await User.findById(id).select("-password");

        user.displayName = displayName ?? user.displayName;
        user.email = email ?? user.email;
        user.username = username ?? user.username;
        user.gender = gender ?? user.gender;
        user.picture = picture ?? user.picture;
        user.learn = learn ?? user.learn;
        user.teach = teach ?? user.teach;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {

        const id = req.user._id;
        const user = await User.findById(id);

        if (!user) return res.status(404).json([]);

        user.reviews.forEach(async (el) => await Review.findByIdAndDelete(el));

        const chats = await Chat.find({
            participants: { $all: [id] },
        });

        if (!chats) return res.status(404).json([]);

        chats.every(delChat);

        await User.findByIdAndDelete(id);

        res.status(204).json({ response: "User deleted succefully" });

    } catch (e) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const delChat = async (chat) => {
    chat.messages.every(delMessage);
    await Chat.findByIdAndDelete(chat._id);
};
const delMessage = async (message) => {
    await Message.findByIdAndDelete(message._id);
} 