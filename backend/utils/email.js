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
  const requestDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `${productName} Request Confirmation`,
    html: `<html>
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
            <h2 aria-hidden="false" >Terra'Novare 🌍</h2>
          </div>
          <div class="content">
            <h3 aria-hidden="false" >🌟 Thank You for Your Product Request!</h3>
            <p>Dear Valued Supporter,</p>
            <p>You have successfully requested <strong>${productName}</strong>. We appreciate your interest and will notify you as soon as it's available.</p>
            <p><strong>Requested On:</strong> ${requestDate}</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p aria-hidden="false" style="text-align:center;">
              <a aria-hidden="false" href="https://www.terranovare.tech" target="_blank">Visit Terra'Novare</a>
            </p>
          </div>
          <div class="footer">
            <p>🌱 Together, we rise. | Terra’Novare Team</p>
            <p><a aria-hidden="false" href="mailto:support@terranovare.tech">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    // logger.info("📩 Confirmation email sent to:", to);
  } catch (error) {
    logger.error("❌ Error sending email:", error);
  }
};
