import nodemailer from "nodemailer"
import bcrypt from 'bcryptjs'
import sql from "../db.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
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
    res.json(user[0]); // ✅ Ensure roles is returned
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const requestEmailVerification = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const user_id = req.user.id;

    // Generate a verification token
    const token = jwt.sign({ user_id, newEmail }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Send verification email
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: "Verify your new email",
      text: `Click the link to verify your new email: ${verificationLink}`,
    });

    res.json({ message: "Verification email sent!" });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ error: "Failed to send verification email" });
  }
};
export const sendProductRequestEmail = async (to, productName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Product Request Confirmation",
    text: `Thank you for requesting ${productName}. We will notify you once it's available!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { username, fullname, address, city, state, country } = req.body;

    if (!username || !fullname) {
      return res.status(400).json({ error: "Username and full name are required." });
    }

    const updatedUser = await sql`
      UPDATE users
      SET 
        username = ${username},  
        fullname = ${fullname}, 
        address = ${address}, 
        city = ${city}, 
        state = ${state}, 
        country = ${country}
      WHERE user_id = ${userId}
      RETURNING user_id, username, fullname, email, address, city, state, country;
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new passwords are required" });
    }

    // 🔹 Fetch the user's existing password
    const user = await sql`SELECT password FROM users WHERE user_id = ${userId}`;
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔹 Compare old password
    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // 🔹 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 Update the password in the database
    await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE user_id = ${userId}
    `;

    console.log("✅ Password updated for user:", userId);
    return res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("❌ Error updating password:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};