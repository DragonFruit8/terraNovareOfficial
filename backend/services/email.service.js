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
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Product Request Confirmation",
        text: `Thank you for requesting ${productName}. We will notify you once it's available!`,
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
