import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
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
    let { username, fullname, email, password, roles } = req.body;
    email = email.toLowerCase();

    const validRoles = ['user','admin','moderator'];
    const userRole = validRoles.includes(roles) ? roles : 'user';

    if (!username || !fullname || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // 🔹 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Insert user with default role ["user"]
    const newUser = await pool.query(
      `INSERT INTO users (username, fullname, email, password, roles)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, username, fullname, email, roles`,
      [username, fullname, email, hashedPassword, ['user']]
    );

    res.json({
      message: "User registered successfully!",
      user: newUser.rows[0].id,
      role: newUser.rows[0].roles
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};
// ✅ Login Controller - Ensure Token Includes Roles
export const login = async (req, res) => {
  try {

    // ✅ Validate input early
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { email, password } = req.body;
    const loginEmail = email.trim().toLowerCase(); // ✅ Fixed variable name

    // ✅ Query DB for user
    const { rows } = await pool.query(
      `SELECT user_id, username, email, password, roles
       FROM users
       WHERE email = $1`,
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

    // ✅ Ensure roles are properly formatted
    const roles = Array.isArray(user.roles)
      ? user.roles
      : user.roles ? user.roles.split(",") : [];

    if (roles.length === 0) {
      console.error("❌ Error: User has no roles assigned!", { user_id: user.user_id, loginEmail: user.email });
      return res.status(500).json({ error: "User roles missing" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        roles: roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // ✅ Return token & user data (excluding password)
    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        roles: roles,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    console.log("✅ User fetched successfully:", user.rows[0]);
    res.json(user.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    console.log("🔍 Incoming User ID:", req.user?.id); // ✅ Debug log

    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const user = await User.findById(req.user.id).select("-password"); // ✅ Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    let { username, fullname, email, address, city, state, country } = req.body;
    email = email.toLowerCase();

    if (!fullname || !email || !username) {
      return res.status(400).json({ error: "Username, full name, and email are required" });
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
    const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // 🔹 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 Update password in database
    await pool.query(
      `UPDATE users SET password = $1 WHERE user_id = $2`,
      [hashedPassword, userId]
    );

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
    const user = await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email]);

    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ userId: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (error) {
    res.status(500).json({ error: "Error sending email" });
  }
};
// ✅ Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [hashedPassword, decoded.userId]);

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
