import jwt from "jsonwebtoken";
import pool from "../db.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Authenticate User Middleware
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Decoded Token:", decoded);
    return next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

// ✅ Admin Check Middleware
export const isAdmin = async (req, res, next) => {
  try {
    console.log("🔍 Checking Admin Role:", req.user.roles); // Debugging

    if (!req.user?.roles?.includes("admin")) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    if (!req.user || !req.user.roles.includes("admin")) {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    console.error("❌ Error in isAdmin Middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
