import nodemailer from "nodemailer";

// ✅ Always create a new transporter instance
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // ✅ Bypass TLS verification (use with caution)
    },
    connectionTimeout: 20000, // ✅ Increase timeout to 20 seconds
    greetingTimeout: 10000, // ✅ Increase greeting timeout
    socketTimeout: 20000, // ✅ Increase socket timeout
    debug: true, // ✅ Debugging
    logger: true, // ✅ Logging
});

// ✅ Function to send emails
export const sendProductRequestEmail = async (to, productName) => {

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
        console.log("📧 Sending email to:", to);
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

export { transporter };
