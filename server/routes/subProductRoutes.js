import express from "express";
import {
  getAllSubProducts,
  getSubProductById,
  createSubProduct,
  updateSubProduct,
  deleteSubProduct,
  getSubProductImage,
  createSubProductImage,
  deleteSubProductImage,
} from "../controllers/subProductController.js";

const router = express.Router();

router.get("/getSubProducts", getAllSubProducts);
router.get("/getSubProduct/:id", getSubProductById);
router.post("/createSubProduct", createSubProduct);
router.put("/updateSubProduct/:id", updateSubProduct);
router.delete("/deleteSubProduct/:id", deleteSubProduct);
router.get("/getSubProductImage", getSubProductImage);
router.post("/uploadSubProductImage", createSubProductImage);
router.delete("/deleteSubProductImage/:id", deleteSubProductImage);

export default router;
