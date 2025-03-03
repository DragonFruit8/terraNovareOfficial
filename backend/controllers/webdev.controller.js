import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const handleWebDevInquiry = async (req, res) => {
  try {
    const {
      name, email, phone, company, industry, website, websiteType,
      features, techStack, budget, deadline, notes
    } = req.body;

    if (!name || !email || !phone || !websiteType || !techStack || !budget) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // console.log("📩 New Website Development Inquiry:", req.body);

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Web Dev Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `Web Dev Inquiry from ${req.body.name}`,
      html: `
        <h2>New Website Development Inquiry</h2>
        <p><strong>Name:</strong> <br />${name}</p>
        <p><strong>Email:</strong> <br />${email}</p>
        <p><strong>Phone:</strong> <a href="tel:${phone}"> <br />${phone || "Not Provided"}</a></p>
        <p><strong>Company:</strong> <br />${company || "Not Provided"}</p>
        <p><strong>Industry:</strong> <br />${industry || "Not Provided"}</p>
        <p><strong>Existing Website:</strong> <br />${website || "Not Provided"}</p>
        <p><strong>Website Type:</strong> <br />${websiteType}</p>
        <p><strong>Features:</strong> <br />${features.length ? features.join(", ") : "None"}</p>
        <p><strong>Preferred Tech Stack:</strong> <br />${techStack || "Not Specified"}</p>
        <p><strong>Budget:</strong> <br />${budget}</p>
        <p><strong>Deadline:</strong> <br />${deadline || "Not Specified"}</p>
        <p><strong>Additional Notes:</strong> <br />${notes || "None"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    // console.log("✅ Web dev inquiry sent!");

    res.status(200).json({ message: "Inquiry submitted successfully!" });
  } catch (error) {
    console.error("❌ Error sending inquiry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
