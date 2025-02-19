import express from "express";
import passport from "passport";
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
import {authenticateUser} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticateUser, getUserProfile);
router.put("/update-profile", authenticateUser, updateUserProfile);
router.put("/update-password", authenticateUser, updatePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// router.post("/request-email-verification", authenticateUser, requestEmailVerification);

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
