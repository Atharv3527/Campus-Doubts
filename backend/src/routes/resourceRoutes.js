// backend/src/routes/resourceRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getResources,
  createResource,
  deleteResource,
} from "../controllers/resourceController.js";

const router = express.Router();

router.get("/", getResources);
router.post("/", protect, createResource);
router.delete("/:id", protect, deleteResource);

export default router;
