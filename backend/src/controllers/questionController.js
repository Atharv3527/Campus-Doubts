// backend/src/controllers/questionController.js
import dotenv from "dotenv";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export const createQuestion = async (req, res, next) => {
  try {
    const { title, description, subject, tags } = req.body;

    const question = await Question.create({
      title,
      description,
      subject,
      tags,
      askedBy: req.user._id,
    });

    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const { search, subject, tag, sort, status, mine } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (subject) filter.subject = { $regex: subject, $options: "i" };
    if (tag) filter.tags = tag;
    if (status === "solved") filter.isSolved = true;
    if (status === "unsolved") filter.isSolved = false;
    if (mine === "true" && req.user) filter.askedBy = req.user._id;

    let query = Question.find(filter)
      .populate("askedBy", "name avatar")
      .sort({ createdAt: -1 });

    if (sort === "oldest") query = query.sort({ createdAt: 1 });
    if (sort === "answers") query = query.sort({ answersCount: -1 });

    const questions = await query.exec();
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

export const getMyQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ askedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("askedBy", "name avatar");
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "askedBy",
      "name avatar"
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answers = await Answer.find({ question: question._id })
      .populate("answeredBy", "name avatar")
      .sort({ isAccepted: -1, upvotes: -1, createdAt: -1 });

    res.json({ question, answers });
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const owner = question.askedBy;

    if (!owner) {
      return res
        .status(400)
        .json({ message: "Question has no owner field set" });
    }

    if (owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this question" });
    }

    await Answer.deleteMany({ question: question._id });
    await Question.deleteOne({ _id: question._id });

    return res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    return res.status(500).json({
      message: "Server error while deleting question",
      error: err.message,
    });
  }
};

// POST /api/questions/:id/ai-suggest
export const suggestAiAnswer = async (req, res) => {
  try {
    if (!genAI) {
      return res
        .status(500)
        .json({ message: "AI not configured. Missing GEMINI_API_KEY." });
    }

    const { id } = req.params;
    const { draft } = req.body || {};

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // ✅ Use a valid, stable model name
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Changed from "gemini-2.0-flash-live" to a stable model
    });

    const prompt = `
You are helping engineering college students on a campus Q&A website.

Write a clear, student-friendly explanation for this question.
- Use simple language like explaining to a junior.
- Use bullet points.
- Keep it around 8-10 lines.
- Do NOT mention that you are an AI.
- dont give any symbol or special character in suggestion

Question title: ${question.title}
Description: ${question.description || "No description"}
Subject: ${question.subject || "Not specified"}

${
  draft && draft.trim()
    ? `The student already started this answer:\n"${draft.trim()}"\nRefine and complete it into a better explanation.`
    : "The student has not written anything yet. Provide a fresh explanation."
}
    `.trim();

    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestion = (response.text && response.text().trim()) || "";

    if (!suggestion) {
      return res
        .status(500)
        .json({ message: "AI did not return any text suggestion." });
    }

    return res.json({ suggestion });
  } catch (err) {
    console.error("Gemini suggest error:", err);

    if (err.status === 429) {
      return res.status(429).json({
        message: "AI limit reached for now. Please try again later.",
      });
    }

    if (err.message?.includes("available models")) {
      return res.status(500).json({
        message:
          "Gemini model not available. Check model name or enable it in Google AI Studio.",
        error: err.message,
      });
    }

    return res.status(500).json({
      message: "Failed to generate AI answer",
      error: err.message,
    });
  }
};
