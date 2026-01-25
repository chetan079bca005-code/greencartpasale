import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Email Helper Utility
 * Sends emails using Nodemailer
 */
const sendEmail = async (options) => {
    // 1. Create Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your preferred service
        auth: {
            user: process.env.EMAIL_USER, // e.g., 'your-email@gmail.com'
            pass: process.env.EMAIL_PASS, // e.g., 'your-app-password'
        },
    });

    // 2. Define Email Options
    const mailOptions = {
        from: `GreenCart <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message, // html body
    };

    // 3. Send Email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to prevent crashing the main flow, just log it
        // In production, you might want to retry or log to a monitoring service
    }
};

export default sendEmail;
