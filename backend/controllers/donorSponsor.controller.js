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

    // console.log("📩 New Donor/Sponsor Inquiry:", req.body);

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
      subject: `Donor Inquiry: ${name}`,
      html: `
        <h2>New Website Development Inquiry</h2>
        <p><strong>Name:</strong> <br />${name}</p>
        <p><strong>Email:</strong> <br />${email}</p>
        <p><strong>Organization</strong> <br />${organization}</p>
        <p><strong>Contribution: </strong> <br />${contributionType}</p>
        <p><strong>Involvment: </strong> <br />${involvment || "Not Specified"}</p>
        <p><strong>Message: </strong> <br />${message || "None"}</p>
        <p><strong>Amount: </strong> <br />${amount || "None"}</p>
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
