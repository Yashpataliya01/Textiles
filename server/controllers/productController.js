import Product from "../models/productModel.js";
import SubProduct from "../models/subProductModel.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) query.category = category;

    let products = await Product.find(query).populate("category");
    console.log("products", products, query);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Convert to object and fix image URL
    product = product.toObject();
    product.image = fullUrl(req, product.image);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, image } = req.body;
    const product = await Product.create({
      name,
      description,
      image,
      category,
    });
    product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;

    // Update image if provided
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    // If error occurs, remove uploaded image
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, "..", "uploads", req.file.filename));
    }

    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check for subproducts
    const subProducts = await SubProduct.find({ product: req.params.id });
    if (subProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete product that has subproducts",
      });
    }
    await product.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
