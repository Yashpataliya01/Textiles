import { console } from "inspector";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

// Get all categories
export const getAllCategories = async (req, res) => {
  console.log("Fetching all categories");
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name, image });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    // Check if category has products
    const products = await Product.find({ category: req.params.id });
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category that has products",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};
