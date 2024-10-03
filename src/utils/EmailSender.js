import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "f57719e1c3a4ede041fe4bf2a4580ae3",
  },
});

const emailSender = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Learning authentication" <hi@demomailtrap.com>',
      to: email,
      subject: subject,
      html: `<p>Your verification code is </p> </br> <b>${text}</b>`, // html body
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, `Something went wrong while sending email `);
  }
};

export { emailSender };
