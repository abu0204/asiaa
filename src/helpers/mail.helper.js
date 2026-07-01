import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMailer = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: {
      name: "Asiaa Travel",
      email: process.env.SMTP_USER,
    },
    subject,
    html,
  };

  await sgMail.send(msg);
  console.log("Email sent");
};

export default sendMailer;
