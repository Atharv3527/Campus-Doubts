import express from "express";
import { registerUser, loginUser, getMe, updateMe, googleLogin, getMyStats } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadAvatar } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, uploadAvatar.single("avatar"), updateMe);
router.post('/google', googleLogin);
router.get("/stats", protect, getMyStats);

export default router;
