import Blog from "../models/blogModel.js";

// ✅ Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// ✅ Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const blog = await Blog.create({ title, description, image });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

// ✅ Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true } // Return the updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// ✅ Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};
