import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendProductRequestEmail = async (to, product) => {
  const emailHTML = `
    <html>
      <body>
        <div style="text-align: center; padding: 20px;">
          <h2>🌿 Terra'Novare</h2>
          <p>Thank you for requesting <strong>${productName}</strong> from Terra'Novare.</p>
          <p>We will notify you once it becomes available.</p>
          <p><strong>Requested On:</strong> ${requestDate}</p>
          <a href="https://terranovare.tech" style="background:#184e77;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
            Visit Our Shop
          </a>
          <p style="color:#666;font-size:12px;margin-top:20px;">© ${new Date().getFullYear()} Terra'Novare | All Rights Reserved</p>
        </div>
      </body>
    </html>`;

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: `${productName} Request Confirmation`,
      text: emailHTML,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Confirmation email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
