// backend/src/models/Resource.js
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true }, // or fileUrl if you use uploads
    subject: { type: String },
    semester: { type: String },
    type: {
      type: String,
      enum: ["notes", "pyq", "assignment", "other"],
      default: "notes",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
