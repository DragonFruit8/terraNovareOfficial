import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from '../logger.js';
dotenv.config();


// ✅ Authenticate User Middleware
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.user_id) {
      logger.error("🚫 Token is valid but missing user_id:", decoded);
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    // logger.info("✅ Token Decoded Successfully:", decoded);
    req.user = decoded; // Attach the user data to the request
    next();
  } catch (error) {
    logger.error("🚫 Invalid token:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
// ✅ Admin Check Middleware
export const isAdmin = async (req, res, next) => {
  try {
    // logger.info("🔍 Checking Admin Role:", req.user.roles); // Debugging

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
    logger.error("❌ Error in isAdmin Middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }
    req.user = decoded; // Attach user data
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};