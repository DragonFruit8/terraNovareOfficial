import express from "express";
import pool from "../config/db.js"; // ✅ PostgreSQL connection
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App password (if using Gmail, enable App Passwords)
  },
});

// ✅ Submit Feedback (PostgreSQL + Email)
router.post("/submit", async (req, res) => {
  try {
    const { feedbackType, message, email } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Feedback message is required" });
    }

    console.log("🔍 Received Feedback Data:", { feedbackType, message, email });

    // ✅ Insert into PostgreSQL
    const result = await pool.query(
      "INSERT INTO feedback (feedback_type, message, email) VALUES ($1, $2, $3) RETURNING *",
      [feedbackType, message, email]
    );

    console.log("✅ Feedback saved:", result.rows[0]);

    // ✅ Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin Email where feedback will be sent
      subject: `📩 New Feedback Received (${feedbackType.toUpperCase()})`,
      text: `A new feedback has been submitted:\n\n
        📝 Type: ${feedbackType}\n
        📧 Email: ${email || "Not provided"}\n
        💬 Message: ${message}\n
        🕒 Submitted: ${new Date().toLocaleString()}`,
    };

    // ✅ Send Email
    await transporter.sendMail(mailOptions);
    console.log("📩 Feedback email sent successfully to Admin!");

    res.status(201).json({ message: "Feedback submitted successfully and email sent", feedback: result.rows[0] });
  } catch (error) {
    console.error("❌ Error processing feedback:", error);
    res.status(500).json({ error: "Server error. Could not submit feedback" });
  }
});

export default router;
