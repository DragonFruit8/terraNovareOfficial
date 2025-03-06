import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const handleWebDevInquiry = async (req, res) => {
  try {
    const {
      name, email, phone, company, industry, packageType,
      addOns = [], maintenancePlan, budget, deadline, notes, estimatedPrice
    } = req.body;

    // ✅ Validate required fields before proceeding
    if (!name || !email || !phone || !packageType || !budget) {
      console.error("❌ Missing required fields in web development inquiry.");
      return res.status(400).json({ error: "Missing required fields." });
    }

    console.log("📩 Preparing to send web development inquiry emails...");

    // ✅ Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📦 Package Descriptions (Frontend should send the name, backend adds more details)
    const packageDescriptions = {
      "Starter Package": "1-page Landing Page + Basic SEO.",
      "Business Package": "5-page Business Site + Contact Form + SEO.",
      "E-Commerce Package": "Shopify or Custom Store + 5 Products + Payment Setup.",
      "Custom MVP": "React-based web app with login & database.",
    };

    // ✅ Email Content (Shared Between Admin & Client)
    const emailContent = `
      <h3>Hello ${name},</h3>
      <p>Thank you for your website development inquiry! Here’s a breakdown of your estimated cost:</p>
      <ul>
        <li><strong>📌 Package:</strong> ${packageType} - $${estimatedPrice.toLocaleString()}</li>
        <li><strong>📦 Package Description:</strong> ${packageDescriptions[packageType] || "No description available."}</li>
        <li><strong>⚙️ Add-Ons:</strong> ${addOns.length ? addOns.join(", ") : "None selected"}</li>
        <li><strong>🔧 Maintenance Plan:</strong> ${maintenancePlan || "None"}</li>
        <li><strong>💰 Budget:</strong> ${budget}</li>
        <li><strong>⏳ Deadline:</strong> ${deadline || "Not specified"}</li>
        <li><strong>📝 Additional Notes:</strong> ${notes || "None"}</li>
      </ul>
      <h2>Total Estimated Cost: <b>$${estimatedPrice.toLocaleString()}</b></h2>
      <p>If you’d like to move forward, let me know! I'm happy to discuss further.</p>
      <br />
      <p>Best,</p>
      <p>[Your Name]</p>
      <p>[Your Contact Info]</p>
      <p>[Your Business Name]</p>
    `;

    // ✅ Send Email to Admin
    try {
      await transporter.sendMail({
        from: `"Web Dev Inquiry" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🌐 New Website Development Inquiry from ${name}`,
        html: emailContent,
      });
      console.log("✅ Admin email sent successfully!");
    } catch (error) {
      console.error("❌ Error sending admin email:", error);
    }

    // ✅ Send Email to Client
    try {
      await transporter.sendMail({
        from: `"Web Dev Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🌐 Your Web Development Inquiry Confirmation`,
        html: emailContent,
      });
      console.log("✅ Client email sent successfully!");
    } catch (error) {
      console.error("❌ Error sending client email:", error);
    }

    // ✅ Respond to frontend
    res.status(200).json({ message: "Web development inquiry submitted successfully!" });

  } catch (error) {
    console.error("❌ Error processing web development inquiry:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};