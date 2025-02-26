import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

// ✅ Authenticate User Middleware
export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
      console.error("❌ No token provided.");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔑 Decoded User:", decoded); // Debugging log

      req.user = decoded;
      next();
  } catch (error) {
      console.error("❌ Invalid token:", error);
      return res.status(403).json({ error: "Unauthorized: Invalid token" });
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
