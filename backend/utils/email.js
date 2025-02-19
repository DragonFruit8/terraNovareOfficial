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
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Product Request Confirmation",
    text: `Thank you for requesting "${product}". We will notify you once it's available!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Confirmation email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
