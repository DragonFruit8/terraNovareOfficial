import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ✅ Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// ✅ Signup Controller - Add Default Role
export const signup = async (req, res) => {
  try {
    let { username, fullname, email, password, roles, recaptchaToken } = req.body;

    // ✅ Ensure required fields exist
    if (!username || !fullname || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ reCAPTCHA Verification
    if (!recaptchaToken) {
      return res.status(400).json({ error: "reCAPTCHA verification is required." });
    }

    const googleResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!googleResponse.data.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed." });
    }

    // ✅ Normalize & Validate Email
    email = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // ✅ Check for existing user
    const existingUser = await pool.query(`SELECT email FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // ✅ Password Security Check
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters, include a number and special character.",
      });
    }

    // ✅ Validate role or default to 'user'
    const validRoles = ["user", "admin", "moderator"];
    const userRole = validRoles.includes(roles) ? roles : "user";

    // ✅ Securely hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // console.log("🔹 Inserting new user into database...");

    // ✅ Insert user into DB & return user info
    const newUser = await pool.query(
      `INSERT INTO users (username, fullname, email, password, roles)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, username, fullname, email, roles`,
      [username.trim(), fullname.trim(), email, hashedPassword, `{${userRole}}`] // ✅ PostgreSQL-friendly roles
    );

    // console.log("✅ User registered successfully:", newUser.rows[0]);

    return res.status(201).json({
      message: "User registered successfully!",
      user_id: newUser.rows[0].user_id,
      role: newUser.rows[0].roles,
    });

  } catch (error) {
    console.error("❌ Error registering user:", error);

    // ✅ Handle duplicate email error
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email already exists." });
    }

    return res.status(500).json({ error: "Internal server error." });
  }
};
// ✅ Login Controller - Ensure Token Includes Roles
export const login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { email, password, recaptchaToken } = req.body;
    const loginEmail = email.trim().toLowerCase();

    if (!recaptchaToken) {
      return res.status(400).json({ error: "reCAPTCHA token missing" });
    }

    // console.log("🔹 Verifying reCAPTCHA token...");

    const googleResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    // console.log("🔹 Google reCAPTCHA Response:", googleResponse.data);

    if (!googleResponse.data.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    // console.log("✅ reCAPTCHA verified. Proceeding with login...");

    // ✅ Query DB for user
    const { rows } = await pool.query(
      `SELECT user_id, username, email, password, roles FROM users WHERE email = $1`,
      [loginEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    // ✅ Secure password comparison
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 🔹 **Fix: Ensure roles is always an array**
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];

    // console.log("🔹 User roles:", roles);

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        roles
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // console.log("✅ Login successful:", { user_id: user.user_id, email: user.email });

    // ✅ Return token & user data (excluding password)
    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        roles
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); // ✅ Prevents caching
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// ✅ Fetch User Profile
export const getUserProfile = async (req, res) => {
  try {
    console.log("🔍 Incoming User ID:", req.user?.user_id); // ✅ Debugging user ID

    if (!req.user || !req.user.user_id) {
      console.error("🚫 Missing user ID in request!");
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const userId = req.user.user_id;
    const user = await pool.query(
      `SELECT user_id, username, fullname, email, roles, address, city, state, country
       FROM users
       WHERE user_id = $1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // console.log("✅ User fetched successfully:", user.rows[0]);
    res.json(user.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); // ✅ Prevents caching
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    let { username, fullname, email, address, city, state, country } = req.body;
    email = email.toLowerCase();

    if (!fullname || !email || !username) {
      return res
        .status(400)
        .json({ error: "Username, full name, and email are required" });
    }

    // 🔹 Check if username already exists (excluding current user)
    const existingUser = await pool.query(
      `SELECT user_id FROM users WHERE username = $1 AND user_id != $2`,
      [username, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // 🔹 Update user profile
    const updatedUser = await pool.query(
      `UPDATE users
       SET username = $1, fullname = $2, email = $3, address = $4, city = $5, state = $6, country = $7
       WHERE user_id = $8
       RETURNING user_id, username, fullname, email, roles, address, city, state, country`,
      [username, fullname, email, address, city, state, country, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser.rows[0]);
  } catch (error) {
    console.error("❌ Error updating user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Update Password
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords are required" });
    }

    // 🔹 Fetch user data from DB
    const user = await pool.query(
      `SELECT password FROM users WHERE user_id = $1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔹 Validate current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.rows[0].password
    );
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // 🔹 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 Update password in database
    await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
      hashedPassword,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Request Password Reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await pool.query(
      `SELECT user_id FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail, // ✅ Use the normalized email
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("❌ Error in forgotPassword:", error);
    res.status(500).json({ error: "Error sending email" });
  }
};
// ✅ Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
      hashedPassword,
      decoded.userId,
    ]);

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    // ✅ Lowercase username for consistent checking
    const sanitizedUsername = username.toLowerCase().trim();

    const result = await pool.query(
      `SELECT username FROM users WHERE LOWER(username) = $1`,
      [sanitizedUsername]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ available: false });
    }

    res.status(200).json({ available: true });
  } catch (error) {
    console.error("❌ Error checking username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
