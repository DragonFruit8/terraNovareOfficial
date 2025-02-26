import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
      console.error("🚫 Token is valid but missing user_id:", decoded);
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    console.log("✅ Token Decoded Successfully:", decoded);
    req.user = decoded; // Attach the user data to the request
    next();
  } catch (error) {
    console.error("🚫 Invalid token:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
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
