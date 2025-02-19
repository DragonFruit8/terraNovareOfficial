export const isAdmin = (req, res, next) => {
  console.log("🔍 Checking Admin Role:", req.user); // ✅ Debug user roles

  if (!req.user || req.user.roles !== "admin") {
    return res.status(403).json({ error: "Access Denied: Admins Only" });
  }

  console.log("✅ Admin Access Granted");
  next();
};
