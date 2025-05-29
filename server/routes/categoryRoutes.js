import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/getCategories", getAllCategories);
router.get("/getCategory/:id", getCategoryById);
router.post("/createCategory", createCategory);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

export default router;
