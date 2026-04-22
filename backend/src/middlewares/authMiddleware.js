import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes
// authMiddleware.js
export const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Got token for:", req.method, req.originalUrl); // 👈 add this

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    }

    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    console.error("AuthMiddleware error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


// Optional: Admin check
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Not authorized as admin" });
};
