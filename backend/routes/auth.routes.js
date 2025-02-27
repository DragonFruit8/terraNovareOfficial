import express from "express";
import passport from "passport";
import limiter from "../utils/rateLimit.js";
import pool from "../config/db.js";
import {
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  forgotPassword,
  resetPassword
  // requestEmailVerification,
} from "../controllers/auth.controller.js";
import { getCurrentUser } from "../controllers/auth.controller.js";
import { verifyPassword } from "../controllers/verify.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticateUser, getCurrentUser);
// ✅ Apply rate limiting to login & signup routes
router.post("/signup", limiter, signup); // ⏳ Protect signup
router.post("/login", limiter, login); // ⏳ Protect login
router.get("/profile", authenticateUser, getUserProfile);
router.post("/check-username", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ Allow frontend access
  try {
    const { username } = req.body;
    const checkUsername = username.toLowerCase()
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [checkUsername]);

    if (user.rows.length > 0) {
      return res.json({ available: false });
    }

    res.json({ available: true });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update-profile", authenticateUser, updateUserProfile);
router.put("/update-password", authenticateUser, updatePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// router.post("/request-email-verification", authenticateUser, requestEmailVerification);

// 🔐 POST Route to Verify the Password
router.post("/verify-password", verifyPassword);

// 🔹 Google OAuth Authentication Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 🔹 Google Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("✅ Authenticated User:", req.user); // Debugging user data
    res.redirect("/"); // Redirect the user after successful login
  }
);

// 🔹 Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});
export default router;
