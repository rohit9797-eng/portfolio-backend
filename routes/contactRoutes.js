import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1️⃣ Save message in MongoDB
    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    // 2️⃣ Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3️⃣ Email notification to YOU
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message",
      html: `
        <h3>New Message Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    // 4️⃣ Confirmation email to USER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting me",
      html: `
        <h3>Hi ${name}</h3>
        <p>Your message has been received successfully.</p>
        <p>I will get back to you soon.</p>
      `,
    });

    // 5️⃣ Send success response
    res.status(200).json({
      success: true,
      message: "Message submitted successfully",
    });

  } catch (error) {
    console.error("Contact Error:", error);

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

export default router;