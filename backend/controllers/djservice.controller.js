import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const handleDJInquiry = async (req, res) => {
  try {
    const { eventType, eventDate, genres, venue, organizer, email, phone, notes, hours, distance, estimatedQuote } = req.body;

    if (!eventType || !eventDate || !venue || !organizer || !email || !phone || !hours || !distance) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to Admin
    const adminMailOptions = {
      from: `"DJ Service Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New DJ Service Booking - ${eventType}`,
      html: `
        <h2>New DJ Service Booking Request</h2>
        <p><strong>Event Type:</strong> ${eventType}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Genres:</strong> ${genres.join(", ") || "Not Specified"}</p>
        <p><strong>Venue:</strong> ${venue}</p>
        <p><strong>Organizer:</strong> ${organizer}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Estimated Quote:</strong> $${estimatedQuote}</p>
        <p><strong>Additional Notes:</strong> ${notes || "None"}</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // Email to Customer
    const customerMailOptions = {
      from: `"DJ Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `DJ Service Quote - ${eventType}`,
      html: `<h2>Thank you for your booking inquiry!</h2>
        <p>We have received your request for a ${eventType} on ${eventDate}.</p>
        <p><strong>Estimated Cost:</strong> $${estimatedQuote}</p>
        <p>We will be in touch soon with further details.</p>
      `,
    };

    await transporter.sendMail(customerMailOptions);

    res.status(200).json({ message: "Inquiry submitted successfully!" });
  } catch (error) {
    console.error("Error sending inquiry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};