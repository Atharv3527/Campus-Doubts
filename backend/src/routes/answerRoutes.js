// backend/src/routes/answerRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  toggleUpvote,
  acceptAnswer,
} from "../controllers/answerController.js";

const router = express.Router();

router.post("/:id/upvote", protect, toggleUpvote);
router.post("/:id/accept", protect, acceptAnswer);

export default router;
