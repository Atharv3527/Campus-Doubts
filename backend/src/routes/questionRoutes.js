import express from "express";
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  deleteQuestion,
  getMyQuestions,
  suggestAiAnswer
} from "../controllers/questionController.js";
import { addAnswer } from "../controllers/answerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getQuestions);
router.get("/my", protect, getMyQuestions);
router.post("/", protect, createQuestion);
router.get("/:id", getQuestionById);
router.post("/:id/answers", protect, addAnswer);
router.delete("/:id", protect, deleteQuestion);
router.post("/:id/ai-suggest", protect, suggestAiAnswer);

export default router;
