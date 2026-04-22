import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    branch: String,
    year: String,
    bio: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    avatar: {
      type: String, // will store relative URL like "/uploads/avatars/xyz.png"
      default: "",
    },
    googleId: {Type: String}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
