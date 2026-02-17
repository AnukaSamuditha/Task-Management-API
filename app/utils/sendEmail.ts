import nodemailer, { type SendMailOptions } from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendEmail = async ({
  email,
  otp,
}: {
  email: string;
  otp: number;
}) => {
  if (!email || !otp) {
    console.log("Missing required information");
    return;
  }

  const mailOptions: SendMailOptions = {
    sender: process.env.APP_USER,
    to: email,
    subject: "TaskFlow Email Verification",
    text: `Your OTP code is ${otp}. It will be discarded after 5 minutes`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Email sent:", info);
  });
};
