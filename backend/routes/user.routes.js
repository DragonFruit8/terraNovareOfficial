import express from "express";
import pool from "../db.js";
import { updateUserProfile, updateUserPassword } from "../controllers/user.controller.js";
import {authenticateUser} from "../middleware/auth.middleware.js";
import { getUserProfile } from "../controllers/auth.controller.js";


const router = express.Router();

// ✅ Fix: Change `POST` to `GET`
router.get("/me", authenticateUser, getUserProfile);
router.get("/profile", authenticateUser, getUserProfile);
router.put("/update", authenticateUser, updateUserProfile);
router.put("/update-profile", authenticateUser, updateUserProfile);
router.put("/update-password", authenticateUser, updateUserPassword);
// ✅ Protected Route: Get logged-in user details

export default router;