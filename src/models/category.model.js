import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        picture: {
            type: String,
            default: "https://e7.pngegg.com/pngimages/75/866/png-clipart-category-management-organization-retail-management-miscellaneous-text-thumbnail.png",
        },
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;