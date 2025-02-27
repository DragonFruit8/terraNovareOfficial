import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const handleWebDevInquiry = async (req, res) => {
  try {
    const {
      name, email, phone, company, industry, website, websiteType,
      features, techStack, budget, deadline, notes
    } = req.body;

    if (!name || !email || !websiteType || !budget) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    console.log("📩 New Website Development Inquiry:", req.body);

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email app password
      },
    });

    // Email content
    const mailOptions = {
      from: `"Web Dev Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `New Web Dev Inquiry from ${name}`,
      html: `
        <h2>New Website Development Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>
        <p><strong>Company:</strong> ${company || "Not Provided"}</p>
        <p><strong>Industry:</strong> ${industry || "Not Provided"}</p>
        <p><strong>Existing Website:</strong> ${website || "Not Provided"}</p>
        <p><strong>Website Type:</strong> ${websiteType}</p>
        <p><strong>Features:</strong> ${features.length ? features.join(", ") : "None"}</p>
        <p><strong>Preferred Tech Stack:</strong> ${techStack || "Not Specified"}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Deadline:</strong> ${deadline || "Not Specified"}</p>
        <p><strong>Additional Notes:</strong> ${notes || "None"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Web dev inquiry sent!");

    res.status(200).json({ message: "Inquiry submitted successfully!" });
  } catch (error) {
    console.error("❌ Error sending inquiry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
