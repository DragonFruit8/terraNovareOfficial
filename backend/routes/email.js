import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your business email
    pass: process.env.EMAIL_PASS, // App password or SMTP password
  },
});

// ✅ Send confirmation email after purchase
router.post("/send-confirmation-email", async (req, res) => {
  const { email, cartItems, total } = req.body;

  if (!email || !cartItems) return res.status(400).json({ error: "Missing required fields." });

  const orderDetails = cartItems
    .map((item) => `${item.quantity}x ${item.name} - $${item.price.toFixed(2)}`)
    .join("\n");

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email, // Customer email
    bcc: process.env.EMAIL_USER, // Sends a copy to yourself
    subject: "✅ Order Confirmation - Terra'Novare",
    text: `Thank you for your purchase! 🎉\n\nYour Order:\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\n\nYour order will be processed shortly.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Confirmation email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

router.post("/solidarity-fund-request", async (req,res)=> {
  const { name, email, phone, message, amount, requestType, medRequestType, medicalType, medicalReason, awardMessage, customRequest } = req.body;
  const requestDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  console.log( name, email, phone, message, amount, requestType, medRequestType, medicalType, medicalReason, awardMessage, customRequest)
  if (!email || !name || !phone || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if(requestType === "default"){
    let requestType = null;
  }
  if(customRequest === "default"){
    let medRequestType = null;
  }

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      cc: email,
      subject: "Request Received",
      html: `
      <html>
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
            <h2 aria-hidden="false" >HVDSA Solidarity Fund 🌍</h2>
          </div>
          <div class="content">
            <h3 aria-hidden="false">Solidarity Fund Request</h3>
            <p>${name},</p>
            <p>Thank you for submitting the Solidarity Fund Form. We will review the information and respond to you within 24-48 hours.</p>
            <p>Phone: <a href="tel:+1${phone}">${phone}</p>
            <p><strong>Requested On:</strong> ${requestDate}</p>
            <p>Request Type: ${requestType, customRequest, medRequestType}</p>
            <p>Monetary: ...Yes</p>
            <p>Monertary Amount: $${amount}</p>
            <p>Medical: ..."N/A"</p>
            <p>Medical Reason: ..."N/A"</p>
            <h5>Is Request URGENT? ...YES</h5>
            <p>How this would help me: ${awardMessage}</p>
            <p>Issue/Reason: ${message}</p>
            <p>If you have any questions, please reach out to use prior.</p>
            
          </div>
          <div class="footer">
            <p> We grow together | Solidarity Fund Team | HVDSA </p>
            <p><a aria-hidden="false" href="mailto:support@terranovare.tech">Contact Us</a></p>
          </div>
        </div>
      </body>
      </html>
      `
  }
  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Confirmation email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }

})

export default router;

// name: "",
// email: "",
// phone: "",
// message: "",
// monetary: [],
// medical: [],
// urgentRequest: [],
// requestType: "default",
// customRequest: "",
// amount: "",
// medRequestType: "default",
// medicalReason: "",
// awardMessage: "",
