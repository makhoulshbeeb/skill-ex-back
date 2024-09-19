import Category from "../models/category.model.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        res.status(200).json(categories);
    } catch (error) {
        console.log("Error in getCategories controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const addCategory = async (req, res) => {
    try {
        const { name, picture } = req.body;
        const category = await Category.create(
            name,
            picture
        );
        await category.save();
        res.status(200).json(category);
    } catch (error) {
        console.log("Error in addCategory controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, picture } = req.body;
        const category = await Category.findById(id);

        category.name = name ?? category.name;
        category.picture = picture ?? category.picture;

        await category.save();
        res.status(200).json(category);
    } catch (error) {
        console.log("Error in editCategory controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);

        res.status(204).json({ response: "Category deleted successfully" });
    } catch (error) {
        console.log("Error in getCategories controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}