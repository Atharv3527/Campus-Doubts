// backend/src/models/Question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String },
    tags: [{ type: String }],
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isSolved: { type: Boolean, default: false },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      default: null,
    },
    answersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
