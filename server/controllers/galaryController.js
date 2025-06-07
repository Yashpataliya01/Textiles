import Galary from "../models/galaryModel.js";

export const getAllGalaries = async (req, res) => {
  try {
    const galaries = await Galary.find();
    res.status(200).json({
      success: true,
      data: galaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching galleries",
      error: error.message,
    });
  }
};

//  create images
export const createGalary = async (req, res) => {
  try {
    const { image } = req.body;
    const galary = await Galary.create({ image });

    res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      data: galary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating gallery",
      error: error.message,
    });
  }
};

//  update images
export const updateGalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    const updatedGalary = await Galary.findByIdAndUpdate(
      id,
      { image },
      { new: true } // Return the updated document
    );

    if (!updatedGalary) {
      return res.status(404).json({
        success: false,
        message: "Galary not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Galary updated successfully",
      data: updatedGalary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating galary",
      error: error.message,
    });
  }
};

//  delete images
export const deleteGalary = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGalary = await Galary.findByIdAndDelete(id);

    if (!deletedGalary) {
      return res.status(404).json({
        success: false,
        message: "Galary not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Galary deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting galary",
      error: error.message,
    });
  }
};
