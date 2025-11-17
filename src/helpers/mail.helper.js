import nodemailer from "nodemailer";

const sendMailer = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER, // full email: info@yourdomain.com
        pass: process.env.SMTP_PASS, // email password
      },
    });

    await transporter.sendMail({
      from: `"Asiaa Travel" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Mail sent to ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export default sendMailer;
