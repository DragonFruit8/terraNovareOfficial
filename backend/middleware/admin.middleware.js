import logger from '../logger.js';

export const isAdmin = (req, res, next) => {
  // logger.info("🔍 Checking Admin Role:", req.user); // ✅ Debug user roles

  if (!req.user || req.user.roles !== "admin") {
    return res.status(403).json({ error: "Access Denied: Admins Only" });
  }

  // logger.info("✅ Admin Access Granted");
  next();
};
