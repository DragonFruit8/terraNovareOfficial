import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sql from "../db.js";
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
    let { username, fullname, email, password } = req.body;
    email = email.toLowerCase();

    if (!username || !fullname || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // 🔹 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Insert user with default role ["user"]
    const newUser = await sql`
      INSERT INTO users (username, fullname, email, password, roles)
      VALUES (${username}, ${fullname}, ${email}, ${hashedPassword}, ARRAY['user'])
      RETURNING user_id, username, fullname, email, roles
    `;

    res.json({
      message: "User registered successfully!",
      user: newUser[0],
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};
// ✅ Login Controller - Ensure Token Includes Roles
export const login = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;
    const user = await sql`
      SELECT user_id, username, roles, password
      FROM users
      WHERE email = ${email}
    `;

    if (user.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Compare password
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Ensure roles exist
    if (!user[0].roles || user[0].roles.length === 0) {
      console.error("❌ Error: User has no roles assigned!");
      return res.status(500).json({ error: "User roles missing" });
    }

    // ✅ Generate Token with Roles
    const token = jwt.sign(
      {
        user_id: user[0].user_id,
        username: user[0].username,
        roles: user[0].roles, // ✅ Ensure roles are stored in the token
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // console.log("✅ Token Issued:", token);
    res.json({ token, user: user[0] });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Fetch User Profile
export const getUserProfile = async (req, res) => {
  try {
      const userId = req.user.user_id;
      const user = await sql`
          SELECT user_id, username, fullname, email, roles, address, city, state, country
          FROM users
          WHERE user_id = ${userId}
      `;

      if (user.length === 0) {
          return res.status(404).json({ error: "User not found" });
      }

      // console.log("✅ User data retrieved:", user[0]); // 🔍 Debug
      res.json(user[0]);
  } catch (error) {
      console.error("❌ Error fetching user data:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
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
    const existingUser = await sql`
      SELECT user_id FROM users WHERE username = ${username} AND user_id != ${userId}
    `;

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // 🔹 Update user profile
    const updatedUser = await sql`
      UPDATE users
      SET 
        username = ${username},  
        fullname = ${fullname}, 
        email = ${email}, 
        address = ${address}, 
        city = ${city}, 
        state = ${state}, 
        country = ${country}
      WHERE user_id = ${userId}
      RETURNING user_id, username, fullname, email, roles, address, city, state, country
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User profile updated:", updatedUser[0]);
    return res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error("❌ Error updating user profile:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
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
    const user = await sql`
      SELECT password FROM users WHERE user_id = ${userId}
    `;

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔹 Validate current password
    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // 🔹 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 Update password in database
    await sql`
      UPDATE users SET password = ${hashedPassword} WHERE user_id = ${userId}
    `;

    console.log("✅ Password updated successfully");
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
    const user = await sql`SELECT user_id FROM users WHERE email = ${email}`;

    if (user.length === 0) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ userId: user[0].user_id }, process.env.JWT_SECRET, { expiresIn: "15m" });
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
    await sql`UPDATE users SET password = ${hashedPassword} WHERE user_id = ${decoded.userId}`;

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};