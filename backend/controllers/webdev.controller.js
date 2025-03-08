import nodemailer from "nodemailer";
import dotenv from "dotenv";
 

dotenv.config();

export const handleWebDevInquiry = async (req, res) => {
  try {
    const {
      name, email, phone, company, industry, packageType,
      addOns = [], maintenancePlan, budget, deadline, notes,
      websitePurpose, preferredDesignStyle, competitorWebsites,
      additionalFeatures, estimatedPrice
    } = req.body;

    if (!name || !email || !phone || !packageType || !budget) {
      console.error("❌ Missing required fields in web development inquiry.");
      return res.status(400).json({ error: "Missing required fields." });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 aria-hidden="false" style="color: #333;">📩 Website Development Inquiry Received</h2>
      <p>Dear ${name},</p>
  
      <p>Thank you for reaching out regarding your website development needs! We have received your inquiry and appreciate the opportunity to assist you. Below is a summary of your request:</p>
  
      <h3 aria-hidden="false" style="color: #444;">📌 Project Overview</h3>
      <ul style="list-style: none; padding: 0;">
        <li aria-hidden="false"><strong>👤 Name:</strong> ${name}</li>
        <li aria-hidden="false"><strong>📧 Email:</strong> ${email}</li>
        <li aria-hidden="false"><strong>📞 Phone:</strong> ${phone}</li>
        <li aria-hidden="false"><strong>🏢 Company:</strong> ${company}</li>
        <li aria-hidden="false"><strong>🏭 Industry:</strong> ${industry}</li>
        <li aria-hidden="false"><strong>💼 Package Selected:</strong> ${packageType} - $${estimatedPrice.toLocaleString()}</li>
        <li aria-hidden="false"><strong>💰 Budget Range:</strong> ${budget}</li>
        <li aria-hidden="false"><strong>⏳ Project Deadline:</strong> ${deadline || "Not specified"}</li>
      </ul>
  
      <h3 aria-hidden="false" style="color: #444;">⚙️ Additional Details</h3>
      <ul style="list-style: none; padding: 0;">
        <li aria-hidden="false"><strong>🌍 Website Purpose:</strong> ${websitePurpose || "Not specified"}</li>
        <li aria-hidden="false"><strong>🎨 Preferred Design Style:</strong> ${preferredDesignStyle || "Not specified"}</li>
        <li aria-hidden="false"><strong>🏆 Competitor Websites:</strong> ${competitorWebsites || "None provided"}</li>
        <li aria-hidden="false"><strong>➕ Additional Features:</strong> ${additionalFeatures || "None"}</li>
        <li aria-hidden="false"><strong>🔧 Maintenance Plan:</strong> ${maintenancePlan || "None"}</li>
        <li aria-hidden="false"><strong>📝 Additional Notes:</strong> ${notes || "None provided"}</li>
      </ul>
  
      <h3 aria-hidden="false" style="color: #444;">💵 Estimated Cost: <span style="color: #27ae60;">$${estimatedPrice.toLocaleString()}</span></h3>
  
      <p aria-hidden="false" style="margin-top: 20px;">Our team will review your request and reach out within the next 24-48 hours to discuss the next steps.</p>
  
      <h3 aria-hidden="false" style="color: #444;">🚀 What's Next?</h3>
      <p>If you'd like to expedite the process, feel free to reply to this email with any additional details or questions. We’re excited to bring your vision to life!</p>
  
      <p aria-hidden="false" style="margin-top: 30px;">Best regards,</p>
      <p><strong>Joshua T. Byers</strong></p>
      <p><strong>Terra'Novare</strong></p>
      <p><strong><a aria-hidden="false" href="https://terranovare.tech">Terranovare Website</strong></p>
    </div>
  `;
  

    await transporter.sendMail({
      from: `"Web Dev Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🌐 New Inquiry from ${name}`,
      html: emailContent,
    });

    await transporter.sendMail({
      from: `"Web Dev Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🌐 Your Inquiry Confirmation`,
      html: emailContent,
    });

    res.status(200).json({ message: "Inquiry submitted successfully!" });

  } catch (error) {
    console.error("❌ Error processing inquiry:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
