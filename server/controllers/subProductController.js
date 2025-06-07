import SubProduct from "../models/subProductModel.js";
import SubProductImage from "../models/subProductImageModel.js";

// Get all subproducts
export const getAllSubProducts = async (req, res) => {
  console.log("fetching", req.query);
  try {
    const { productId } = req.query;
    let query = {};

    if (productId) {
      query.product = productId;
    }

    const subProducts = await SubProduct.find(query).populate({
      path: "product",
      select: "name",
      populate: {
        path: "category",
        select: "name",
      },
    });

    res.status(200).json({
      success: true,
      count: subProducts.length,
      data: subProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subproducts",
      error: error.message,
    });
  }
};
export const getSubProductImage = async (req, res) => {
  console.log("fetching", req.query);
  try {
    const { productId } = req.query;
    let query = {};

    if (productId) {
      query.subProduct = productId; // ✅ FIXED HERE
    }

    const subProducts = await SubProductImage.find(query).populate({
      path: "subProduct", // ✅ This matches your schema
      select: "subProduct", // You can change this to the fields you want from SubProduct
    });

    res.status(200).json({
      success: true,
      count: subProducts.length,
      data: subProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subproducts",
      error: error.message,
    });
  }
};

// Get subproduct by ID
export const getSubProductById = async (req, res) => {
  try {
    const subProduct = await SubProduct.findById(req.params.id).populate({
      path: "product",
      select: "name",
      populate: {
        path: "category",
        select: "name",
      },
    });

    if (!subProduct) {
      return res.status(404).json({
        success: false,
        message: "Subproduct not found",
      });
    }

    res.status(200).json({
      success: true,
      data: subProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subproduct",
      error: error.message,
    });
  }
};

// Create subproduct
export const createSubProduct = async (req, res) => {
  try {
    const { name, description, product, image } = req.body;
    const subProduct = await SubProduct.create({
      name,
      description,
      image,
      product,
    });

    res.status(201).json({
      success: true,
      message: "Subproduct created successfully",
      data: subProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating subproduct",
      error: error.message,
    });
  }
};
export const createSubProductImage = async (req, res) => {
  try {
    const { image, subProduct } = req.body;

    const newSubProductImage = await SubProductImage.create({
      image,
      subProduct,
    });

    res.status(201).json({
      success: true,
      message: "Subproduct image created successfully",
      data: newSubProductImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating subproduct image",
      error: error.message,
    });
  }
};

// Update subproduct
export const updateSubProduct = async (req, res) => {
  try {
    const { name, description, product, image } = req.body;

    const subProduct = await SubProduct.findById(req.params.id);

    if (!subProduct) {
      return res.status(404).json({
        success: false,
        message: "Subproduct not found",
      });
    }

    // Update only the provided fields
    if (name) subProduct.name = name;
    if (description) subProduct.description = description;
    if (product) subProduct.product = product;

    // Update image only if a new URL is provided and it's different
    if (image && image !== subProduct.image) {
      subProduct.image = image;
    }

    await subProduct.save();

    res.status(200).json({
      success: true,
      message: "Subproduct updated successfully",
      data: subProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating subproduct",
      error: error.message,
    });
  }
};

export const updateSubProductImage = async (req, res) => {
  try {
    const { image } = req.body;

    // Find image document by its _id
    const subProductImage = await SubProductImage.findById(req.params.id); // <-- use 'id' instead of 'subProduct'

    if (!subProductImage) {
      return res.status(404).json({
        success: false,
        message: "SubProductImage not found",
      });
    }

    // Update only if image is different
    if (image && image !== subProductImage.image) {
      subProductImage.image = image;
    }

    await subProductImage.save();

    res.status(200).json({
      success: true,
      message: "SubProductImage updated successfully",
      data: subProductImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating subproduct image",
      error: error.message,
    });
  }
};

// Delete subproduct
export const deleteSubProduct = async (req, res) => {
  try {
    const subProduct = await SubProduct.findById(req.params.id);

    if (!subProduct) {
      return res.status(404).json({
        success: false,
        message: "Subproduct not found",
      });
    }
    await subProduct.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subproduct deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting subproduct",
      error: error.message,
    });
  }
};
export const deleteSubProductImage = async (req, res) => {
  try {
    const deleteSubProductImage = await SubProductImage.findById(req.params.id);

    if (!deleteSubProductImage) {
      return res.status(404).json({
        success: false,
        message: "SubproductImage not found",
      });
    }

    await deleteSubProductImage.deleteOne();

    res.status(200).json({
      success: true,
      message: "SubproductImage deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting subproduct",
      error: error.message,
    });
  }
};
