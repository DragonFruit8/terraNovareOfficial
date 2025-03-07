import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { token } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing reCAPTCHA token." });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      new URLSearchParams({
        secret: secretKey,
        response: token
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (response.data.success) {
      return res.json({ success: true, message: "reCAPTCHA verified!" });
    } else {
      return res.status(400).json({ success: false, error: response.data["error-codes"] });
    }
  } catch (error) {
    logger.error("❌ reCAPTCHA verification failed:", error);
    return res.status(500).json({ success: false, message: "Server error during verification." });
  }
});

export default router;
