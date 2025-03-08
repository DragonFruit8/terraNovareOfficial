import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();

export const handleDJInquiry = async (req, res) => {
  try {
    const { eventType, eventDate, genres, venue, organizer, email, phone, notes, hours, distance, estimatedQuote } = req.body;

    // ✅ Validate required fields before proceeding
    if (!eventType || !eventDate || !venue || !organizer || !email || !phone || !hours || !distance) {
      console.error("❌ Missing required fields in inquiry request.");
      return res.status(400).json({ error: "Missing required fields." });
    }

    console.log("📩 Preparing to send emails for DJ Inquiry...");

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
      from: `"DJ Service Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🎵 New DJ Service Booking Inquiry - ${eventType}`,
      html: `
        <h2 aria-hidden="false" >🎧 New DJ Booking Request</h2>
        <p><strong>📅 Event Type:</strong> ${eventType}</p>
        <p><strong>📆 Date:</strong> ${eventDate}</p>
        <p><strong>🎶 Preferred Genres:</strong> ${genres?.length ? genres.join(", ") : "Not Specified"}</p>
        <p><strong>📍 Venue:</strong> ${venue}</p>
        <p><strong>🧑 Organizer:</strong> ${organizer}</p>
        <p><strong>📧 Email:</strong> <a aria-hidden="false" href="mailto:${email}">${email}</a></p>
        <p><strong>📞 Phone:</strong> ${phone}</p>
        <p><strong>🕒 Performance Hours:</strong> ${hours} hours</p>
        <p><strong>🚗 Travel Distance:</strong> ${distance} miles</p>
        <p><strong>💰 Estimated Quote:</strong> <b>$${estimatedQuote}</b></p>
        <p><strong>📝 Additional Notes:</strong> ${notes || "None"}</p>
        <br />
        <p>🔔 <b>Please follow up with the client as soon as possible!</b></p>
      `,
    };

    await transporter.sendMail(adminMailOptions);
    console.log("✅ Admin email sent successfully!");

    // ✅ Email to Customer
    const customerMailOptions = {
      from: `"DJ Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎧 Your DJ Service Quote - ${eventType}`,
      html: `
        <h2 aria-hidden="false" >Thank You for Your DJ Booking Inquiry!</h2>
        <p>Hello ${organizer},</p>
        <p>We have received your request for a <b>${eventType}</b> on <b>${eventDate}</b> at <b>${venue}</b>.</p>
        <p>Here’s a summary of your booking request:</p>
        <ul>
          <li aria-hidden="false"><strong>Preferred Music Genres:</strong> ${genres?.length ? genres.join(", ") : "Not Specified"}</li>
          <li aria-hidden="false"><strong>Performance Hours:</strong> ${hours} hours</li>
          <li aria-hidden="false"><strong>Travel Distance:</strong> ${distance} miles</li>
          <li aria-hidden="false"><strong>Estimated Cost:</strong> <b>$${estimatedQuote}</b></li>
        </ul>
        <p>We will reach out to you soon to discuss further details.</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <br />
        <p>🎵 Looking forward to making your event a success!</p>
        <p><b>Best Regards,</b><br />The DJ Team</p>
      `,
    };

    await transporter.sendMail(customerMailOptions);
    console.log("✅ Customer email sent successfully!");

    // ✅ Response back to frontend
    res.status(200).json({ message: "Inquiry submitted successfully!" });
  } catch (error) {
    console.error("❌ Error sending inquiry:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};
//         