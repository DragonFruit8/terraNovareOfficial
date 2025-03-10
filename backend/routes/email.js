import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your business email
    pass: process.env.EMAIL_PASS, // App password or SMTP password
  },
});

// ✅ Send confirmation email after purchase
router.post("/send-confirmation-email", async (req, res) => {
  const { email, cartItems, total } = req.body;

  if (!email || !cartItems) return res.status(400).json({ error: "Missing required fields." });

  const orderDetails = cartItems
    .map((item) => `${item.quantity}x ${item.name} - $${item.price.toFixed(2)}`)
    .join("\n");

  const mailOptions = {
    from: process.env.ADMIN,
    to: email, // Customer email
    bcc: process.env.EMAIL_USER, // Sends a copy to yourself
    subject: "✅ Order Confirmation - Terra'Novare",
    text: `Thank you for your purchase! 🎉\n\nYour Order:\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\n\nYour order will be processed shortly.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Confirmation email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

export default router;
