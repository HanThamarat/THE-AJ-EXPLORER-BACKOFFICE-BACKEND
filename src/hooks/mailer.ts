import nodemailer, { TransportOptions } from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: process.env.MAILER_PORT,
  secure: false,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
} as TransportOptions);