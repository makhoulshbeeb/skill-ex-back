import Category from "../models/category.model";

export const getCategories = async (req, res) => {
    try {
        const categories = await Chat.find({});

        res.status(200).json(categories);
    } catch (error) {
        console.log("Error in getChats controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}