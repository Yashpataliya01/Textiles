import express from "express";
import {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
} from "../controllers/blogController.js";

const router = express.Router();
router.get("/getBlogs", getAllBlogs);
router.post("/createBlog", createBlog);
router.delete("/deleteBlog/:id", deleteBlog);
router.put("/updateBlog/:id", updateBlog);

export default router;
