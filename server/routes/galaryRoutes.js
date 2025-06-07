import express from "express";
import {
  getAllGalaries,
  createGalary,
  updateGalary,
  deleteGalary,
} from "../controllers/galaryController.js";

const router = express.Router();
router.get("/getGalaries", getAllGalaries);
router.post("/createGalary", createGalary);
router.put("/updateGalary/:id", updateGalary);
router.delete("/deleteGalary/:id", deleteGalary);

export default router;
