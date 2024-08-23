import User from "../models/user.model.js";

export const getUsersBySearch = async (req, res) => {
    try {

        const search = req.params.search;

        const rgx = (pattern) => new RegExp(`.*${pattern}.*`, 'i');
        const searchRgx = rgx(search);

        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId }, displayName: searchRgx }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserByUsername = async (req, res) => {
    try {

        const username = req.params.username;

        const user = User.findOne({ username: username });

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

        const users = await User.find({ learn: { $in: teach }, teach: { $in: learn } });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const editUser = async (req, res) => {

    try {
        const id = req.user._id;
        const { displayName, email, username, gender, age, picture, learn, teach } = req.body;

        const user = await User.findById(id);

        user.displayName = displayName ?? user.displayName;
        user.email = email ?? user.email;
        user.username = username ?? user.username;
        user.gender = gender ?? user.gender;
        user.age = age ?? user.age;
        user.picture = picture ?? user.picture;
        user.learn = learn ?? user.learn;
        user.teach = teach ?? user.teach;

        console.log(user);

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

        user.reviews.forEach(el => Message.findByIdAndDelete(el));

        await User.findByIdAndDelete(id);

        res.status(204).json({ response: "User deleted succefully" });

    } catch (e) {
        console.error("Error in getUsersBySearch: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};