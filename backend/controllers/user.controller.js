import { transporter } from "../services/email.service.js"; // ✅ Reuse global transporter
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      // console.error("🔍 Incoming User ID: Undefined (Invalid Token)");
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    // console.log("🔍 Incoming User ID:", req.user.user_id);

    const user = await pool.query(
      `SELECT user_id, username, fullname, email, roles, address, city, state, country
       FROM users
       WHERE user_id = $1`,
      [req.user.user_id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    // console.log("🔍 Checking user roles:", req.user);

    if (!req.user?.roles || !req.user.roles.includes("admin")) {
      console.error("❌ Unauthorized: User is not an admin.");
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    // console.log("✅ Fetching users from database...");
    const users = await pool.query(
      "SELECT user_id AS id, email, roles FROM users ORDER BY user_id ASC"
    );

    // console.log("✅ Users fetched:", users.rows);
    res.status(200).json(users.rows);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
export const requestEmailVerification = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const user_id = req.user.id;

    const token = jwt.sign({ user_id, newEmail }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

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
  const requestDate = requestDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `${productName} Request Confirmation`,
    html: `<html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; }
            .email-container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto; }
            .header { text-align: center; padding: 10px; background-color: #1a1a1a; color: #fff; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; text-align: left; }
            .footer { text-align: center; font-size: 12px; color: #888; padding: 10px; }
            .button { display: inline-block; padding: 10px 15px; background-color: #e63946; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .button:hover { background-color: #cc3333; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Terra'Novare 🌍</h2>
            </div>
            <div class="content">
              <h3>🌟 Thank You for Your Product Request!</h3>
              <p>Dear Valued Supporter,</p>
              <p>You have successfully requested <strong>${productName}</strong>. We appreciate your interest and will notify you as soon as it's available.</p>
              <p><strong>Requested On:</strong> ${requestDate}</p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p style="text-align:center;">
                <a href="https://www.terranovare.tech" target="_blank">Visit Terra'Novare</a>
              </p>
            </div>
            <div class="footer">
              <p>🌱 Together, we rise. | Terra’Novare Team</p>
              <p><a href="mailto:support@terranovare.tech">Contact Support</a></p>
            </div>
          </div>
        </body>
        </html>`,
  };

  try {
    // console.log("📨 Sending email to:", to);
    const info = await transporter.sendMail(mailOptions);
    // console.log("✅ Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    // Ensure the authenticated user exists (set by authentication middleware)
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // console.log("Update profile request body:", req.body, req.user.user_id, );

    const userId = req.user.user_id;
    const { username, address, city, state, country } = req.body;

    // Trim inputs to avoid unintended spaces
    const trimmedUsername = username ? username.trim() : "";
    const trimmedAddress = address ? address.trim() : address;
    const trimmedCity = city ? city.trim() : city;
    const trimmedState = state ? state.trim() : state;
    const trimmedCountry = country ? country.trim() : country;

    // Validate required fields: username is mandatory
    if (!trimmedUsername) {
      return res.status(400).json({ error: "Username is required." });
    }

    // Update the user profile in the database with the provided fields
    const result = await pool.query(
      `
      UPDATE users
      SET username = $1,
          address = $2,
          city = $3,
          state = $4,
          country = $5
      WHERE user_id = $6
      RETURNING user_id, username, email, address, city, state, country;
      `,
      [
        trimmedUsername,
        trimmedAddress,
        trimmedCity,
        trimmedState,
        trimmedCountry,
        userId,
      ]
    );

    // If no rows were returned, the user wasn't found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the updated user profile
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating profile:", error.stack || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both current and new passwords are required" });
    }

    // 🔹 Fetch the user's existing password
    const user = await pool.query(
      `SELECT password FROM users WHERE user_id = $1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔹 Compare old password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.rows[0].password
    );
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // 🔹 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 Update the password in the database
    await pool.query(
      `UPDATE users
       SET password = $1
       WHERE user_id = $2`,
      [hashedPassword, userId]
    );

    // console.log("✅ Password updated for user:", userId);
    return res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("❌ Error updating password:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
