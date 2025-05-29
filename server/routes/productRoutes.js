import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/getProducts", getAllProducts);
router.get("/getProduct/:id", getProductById);
router.post("/createProduct", createProduct);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;
