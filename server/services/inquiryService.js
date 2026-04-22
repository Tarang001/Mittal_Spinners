import nodemailer from "nodemailer";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const inquiryTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function createInquiry({ name, email, message }) {
  const inquiry = await prisma.inquiry.create({
    data: {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      message: String(message).trim(),
    },
  });

  try {
    await inquiryTransporter.sendMail({
      from: env.EMAIL_USER,
      to: "MittalSpinners@gmail.com",
      subject: "New Inquiry from Mittal Spinners Website",
      text: `Name: ${String(name).trim()}\nEmail: ${String(email).trim()}\nMessage: ${String(message).trim()}`,
    });
    logger.email("sent", "Inquiry notification delivered");
  } catch (emailError) {
    logger.email("failed", emailError instanceof Error ? emailError.message : String(emailError));
  }

  return inquiry;
}
