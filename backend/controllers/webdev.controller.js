import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const handleWebDevInquiry = async (req, res) => {
  try {
    const {
      name, email, phone, company, industry, website, websiteType,
      features, techStack, budget, deadline, notes
    } = req.body;

    // ✅ Validate required fields before proceeding
    if (!name || !email || !phone || !websiteType || !techStack || !budget) {
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

    // ✅ Email to Admin
    const adminMailOptions = {
      from: `"Web Dev Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🌐 New Website Development Inquiry from ${name}`,
      html: `
        <h2>🌐 New Website Development Inquiry</h2>
        <p><strong>🧑 Name:</strong> ${name}</p>
        <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>📞 Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
        <p><strong>🏢 Company:</strong> ${company || "Not Provided"}</p>
        <p><strong>🏭 Industry:</strong> ${industry || "Not Provided"}</p>
        <p><strong>🌍 Existing Website:</strong> ${website ? `<a href="${website}" target="_blank">${website}</a>` : "Not Provided"}</p>
        <p><strong>📌 Website Type:</strong> ${websiteType}</p>
        <p><strong>⚙️ Features:</strong> ${features?.length ? features.join(", ") : "None specified"}</p>
        <p><strong>🛠️ Preferred Tech Stack:</strong> ${techStack}</p>
        <p><strong>💰 Budget:</strong> ${budget}</p>
        <p><strong>⏳ Deadline:</strong> ${deadline || "Not Specified"}</p>
        <p><strong>📝 Additional Notes:</strong> ${notes || "None"}</p>
        <br />
        <p>🔔 <b>Please follow up with the client as soon as possible!</b></p>
      `,
    };

    await transporter.sendMail(adminMailOptions);
    console.log("✅ Admin email sent successfully!");

    // ✅ Email to Client
    const clientMailOptions = {
      from: `"Web Dev Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🌐 Your Web Development Inquiry Confirmation`,
      html: `
        <h2>Thank You for Your Website Development Inquiry!</h2>
        <p>Hello ${name},</p>
        <p>We have received your request for a new website and appreciate your interest in working with us.</p>
        <p>Here’s a summary of your request:</p>
        <ul>
          <li><strong>🏢 Company:</strong> ${company || "Not Provided"}</li>
          <li><strong>🏭 Industry:</strong> ${industry || "Not Provided"}</li>
          <li><strong>🌍 Website Type:</strong> ${websiteType}</li>
          <li><strong>⚙️ Features:</strong> ${features?.length ? features.join(", ") : "None specified"}</li>
          <li><strong>🛠️ Preferred Tech Stack:</strong> ${techStack}</li>
          <li><strong>💰 Budget:</strong> ${budget}</li>
          <li><strong>⏳ Deadline:</strong> ${deadline || "Not Specified"}</li>
        </ul>
        <p>One of our team members will reach out to discuss your project in more detail.</p>
        <p>If you have any additional questions, feel free to reply to this email.</p>
        <br />
        <p>🌟 We look forward to working with you!</p>
        <p><b>Best Regards,</b><br />The Web Development Team</p>
      `,
    };

    await transporter.sendMail(clientMailOptions);
    console.log("✅ Client email sent successfully!");

    // ✅ Respond to frontend
    res.status(200).json({ message: "Web development inquiry submitted successfully!" });
  } catch (error) {
    console.error("❌ Error sending web development inquiry:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};
