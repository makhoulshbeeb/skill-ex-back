import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Category from "../models/category.model.js"

export const getUserByToken = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            _id: user._id,
            displayName: user.displayName,
            username: user.username,
            picture: user.picture,
            avgRating: user.avgRating
        });
    } catch (error) {
        console.error("Error in getUsersByToken: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUsersBySearch = async (req, res) => {
    try {
        var search = req.params.search;

        if (!search) {
            search = ''
        }

        const rgx = (pattern) => new RegExp(`.*${pattern}.*`, 'i');
        const searchRgx = rgx(search);

        const loggedInUserId = req.user ? req.user._id : null;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId }, $or: [{ displayName: searchRgx }, { username: searchRgx }] }).select("-password").populate('teach.category').sort({ avgRating: -1 });

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserById = async (req, res) => {
    try {

        const userId = req.params.id;

        const user = await User.findById(userId).select("-password").populate("reviews");

        if (!user) {
            return res.status(400).json({ error: "User doesn't exist" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUsersByUsername: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserByUsername = async (req, res) => {
    try {

        const username = req.params.username;

        const user = await User.findOne({ username })
            .select("-password")
            .populate({
                path: "reviews",
                populate: {
                    path: 'reviewerId',
                    select: '_id displayName username email picture'
                }
            })
            .populate("teach.category learn.category");

        if (!user) {
            return res.status(400).json({ error: "User doesn't exist" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUsersByUsername: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUsersByMatch = async (req, res) => {
    try {
        var learn = req.user.learn;
        var teach = req.user.teach;

        var learnTemp = [];
        var teachTemp = [];

        learn.forEach(el => {
            learnTemp.push(el.category);
        });

        teach.forEach(el => {
            teachTemp.push(el.category);
        });

        learn = learnTemp.toString().split(',');
        teach = teachTemp.toString().split(',');

        const loggedInUserId = req.user._id;

        // const users = await User.aggregate([
        //     {
        //         $match: {
        //             _id: { $ne: loggedInUserId },
        //             learn: { category: { $in: teach } },
        //             // teach: { $in: learn },
        //         }
        //     },
        //     {
        //         $project: {
        //             avgRating: 1,
        //             displayName: 1,
        //             username: 1,
        //             email: 1,
        //             picture: 1,
        //             bio: 1,
        //             learn: 1,
        //         }
        //     }

        // ]).sort({ avgRating: -1 });

        const users = await User.find({
            _id: { $ne: loggedInUserId },
            'teach.category': { $in: learn },
            'learn.category': { $in: teach }
        }).select("-password").sort({ avgRating: -1 }).populate('teach.category');

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersByMatch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const endorseUser = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { categoryId } = req.body;
        const receiver = await User.findOne({ _id: receiverId });

        if (!receiver) {
            return res.status(400).json({ error: "User doesn't exist" });
        }
        receiver.teach.forEach((el) => {
            if (el.category == categoryId) {
                var index = el.endorsements.indexOf(senderId);
                if (index !== -1) {
                    el.endorsements.splice(index, 1);
                } else {
                    el.endorsements.push(senderId);
                }
            }
        });
        await receiver.save();
        res.status(200).json({ message: "User endorsed successfully!" })
    } catch (error) {
        console.error("Error in endorseUser: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        await User.findByIdAndUpdate(id, { role: role });
        res.status(200).json({ response: "User role updated" })
    } catch (error) {
        console.error("Error in updateRole: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const editUser = async (req, res) => {

    try {
        const id = req.user._id;
        var { displayName, email, username, gender, bio, picture, learn, teach } = req.body;
        const user = await User.findById(id).select("-password");

        if (teach) {
            const temp = teach;
            teach = teach.filter(el => user.teach.every(el2 => el2.category.toString() != el.category.toString()));
            user.teach.forEach(el => {
                temp.forEach(el2 => {
                    if (el.category == el2.category) {
                        teach.push(el)
                    }
                })
            })
        }
        console.log(teach)

        user.displayName = displayName ?? user.displayName;
        user.email = email ?? user.email;
        user.username = username ?? user.username;
        user.gender = gender ?? user.gender;
        user.bio = bio ?? user.bio;
        user.picture = picture ?? user.picture;
        user.learn = learn ?? user.learn;
        user.teach = teach ?? user.teach;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in editUser: ", error.message);
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
        console.error("Error in deleteUser: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUserAdmin = async (req, res) => {
    try {

        const { id } = req.params;
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
        console.error("Error in deleteUser: ", error.message);
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