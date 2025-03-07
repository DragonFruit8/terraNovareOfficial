import bcrypt from "bcrypt";
import dotenv from "dotenv";
import logger from '../logger.js';

dotenv.config();

// 🔍 API Controller: Verify Password
export const verifyPassword = async (req, res) => {
  try {
    // logger.info("🔍 Received request body:", req.body);

    const { password } = req.body;
    if (!password) {
      // logger.info("❌ No password provided!");
      return res.status(400).json({ error: "Password is required" });
    }

    const storedHashedPassword = process.env.ENCRYPTED_PASSWORD;
    if (!storedHashedPassword) {
      // logger.info("❌ No stored password found in .env!");
      return res.status(500).json({ error: "No stored password found." });
    }

    // logger.info("🔍 Stored Hashed Password:", storedHashedPassword);

    // ✅ Compare the plaintext password with the stored hash
    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    // logger.info("✅ Password Match Result:", isMatch); // 🚀 Debugging line

    if (isMatch) {
      // logger.info("✅ Password is correct! Granting access.");
      
      // 🔹 Add this log to confirm if this line is reached
      // logger.info("🚀 Sending success response to client...");
      
      return res.json({ success: true }); // ✅ Ensure response is sent
    } else {
      // logger.info("❌ Password did NOT match!");
      return res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    logger.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Verification failed" });
  }
};
