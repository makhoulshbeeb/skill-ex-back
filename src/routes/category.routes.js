import express from "express";
import { getCategories } from "../controllers/category.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get('/', getCategories);
router.post('/', adminAuth, getCategories);
router.patch('/:id', adminAuth, getCategories);
router.delete('/:id', adminAuth, getCategories);

export default router;