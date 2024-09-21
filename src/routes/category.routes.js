import express from "express";
import { addCategory, deleteCategory, editCategory, getCategories } from "../controllers/category.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get('/', getCategories);
router.post('/', adminAuth, addCategory);
router.patch('/:id', adminAuth, editCategory);
router.delete('/:id', adminAuth, deleteCategory);

export default router;