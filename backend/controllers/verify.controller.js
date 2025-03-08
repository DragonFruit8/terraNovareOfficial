import bcrypt from "bcrypt";
import dotenv from "dotenv";
 

dotenv.config();

// 🔍 API Controller: Verify Password
export const verifyPassword = async (req, res) => {
  try {
    // console.log("🔍 Received request body:", req.body);

    const { password } = req.body;
    if (!password) {
      // console.log("❌ No password provided!");
      return res.status(400).json({ error: "Password is required" });
    }

    const storedHashedPassword = process.env.ENCRYPTED_PASSWORD;
    if (!storedHashedPassword) {
      // console.log("❌ No stored password found in .env!");
      return res.status(500).json({ error: "No stored password found." });
    }

    // console.log("🔍 Stored Hashed Password:", storedHashedPassword);

    // ✅ Compare the plaintext password with the stored hash
    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    // console.log("✅ Password Match Result:", isMatch); // 🚀 Debugging line

    if (isMatch) {
      // console.log("✅ Password is correct! Granting access.");
      
      // 🔹 Add this log to confirm if this line is reached
      // console.log("🚀 Sending success response to client...");
      
      return res.json({ success: true }); // ✅ Ensure response is sent
    } else {
      // console.log("❌ Password did NOT match!");
      return res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Verification failed" });
  }
};
