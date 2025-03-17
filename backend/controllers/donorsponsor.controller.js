import nodemailer from "nodemailer";
import dotenv from "dotenv";



dotenv.config();

export const handleSponsorInquiry = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      organization, 
      contributionType, 
      involvement, 
      impacts, 
      message, 
      amount } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !contributionType) {
      console.error("❌ Missing required fields in sponsorship inquiry.");
      return res.status(400).json({ error: "Missing required fields." });
    }

    console.log("📩 Preparing to send sponsorship inquiry emails...");

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
      from: `"Sponsor Inquiry" <${email}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🌟 New Sponsorship Inquiry from ${name}`,
      html: `
        <h2 aria-hidden="false" >🌟 New Sponsorship Inquiry</h2>
        <p><strong>🧑 Name:</strong> ${name}</p>
        <p><strong>📧 Email:</strong> <a aria-hidden="false" href="mailto:${email}">${email}</a></p>
        <p><strong>🏢 Organization:</strong> ${organization || "Not specified"}</p>
        <p><strong>💡 Contribution Type:</strong> ${contributionType}</p>
        <p><strong>🤝 Ways They Want to Be Involved:</strong> ${involvement.length ? involvement.join(", ") : "Not specified"}</p>
        <p><strong>🌍 Expected Impact:</strong> ${impacts.length ? impacts.join(", ") : "Not specified"}</p>
        <p><strong>💰 Amount (if monetary):</strong> ${amount ? `$${amount}` : "Not specified"}</p>
        <p><strong>📝 Additional Message:</strong> ${message || "None"}</p>
        <br />
        <p>🔔 <b>Please follow up with the sponsor inquiry as soon as possible!</b></p>
      `,
    };

    await transporter.sendMail(adminMailOptions);
    console.info("✅ Admin email sent successfully!");

    // ✅ Email to Sponsor
    const sponsorMailOptions = {
      from: `"Sponsorship Team" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: `🌟 Thank You for Your Sponsorship Inquiry, ${name}!`,
      html: `
        <h2 aria-hidden="false" >Thank You for Your Interest in Sponsoring!</h2>
        <p>Hello ${name},</p>
        <p>We have received your sponsorship inquiry and truly appreciate your support.</p>
        <p>Here’s a summary of your inquiry:</p>
        <ul>
          <li aria-hidden="false"><strong>🏢 Organization:</strong> ${organization || "Not specified"}</li>
          <li aria-hidden="false"><strong>💡 Contribution Type:</strong> ${contributionType}</li>
          <li aria-hidden="false"><strong>🤝 Involvement:</strong> ${involvement.length ? involvement.join(", ") : "Not specified"}</li>
          <li aria-hidden="false"><strong>🌍 Expected Impact:</strong> ${impacts.length ? impacts.join(", ") : "Not specified"}</li>
          <li aria-hidden="false"><strong>💰 Contribution Amount:</strong> ${amount ? `$${amount}` : "Not specified"}</li>
        </ul>
        <p>We will reach out to you soon to discuss how we can collaborate further.</p>
        <p>If you have any additional questions, feel free to reply to this email.</p>
        <br />
        <p>🌱 Thank you for being part of our mission to create a lasting impact!</p>
        <p><b>Best Regards,</b><br />The Sponsorship Team</p>
      `,
    };

    await transporter.sendMail(sponsorMailOptions);
    console.info("✅ Sponsor email sent successfully!");

    // ✅ Respond to frontend
    res.status(200).json({ message: "Sponsorship inquiry submitted successfully!" });
  } catch (error) {
    console.error("❌ Error sending sponsorship inquiry:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};
