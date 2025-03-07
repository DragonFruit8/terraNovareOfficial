import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer Token

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next(); // ✅ Proceed to next middleware
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};
