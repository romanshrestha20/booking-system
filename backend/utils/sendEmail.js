import nodemailer from "nodemailer";

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

/**
 * Sends a confirmation email with a 6-digit code.
 * @param {string} email - The recipient's email address.
 * @param {string} code - The 6-digit confirmation code.
 */
export const sendConfirmationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: email, // Recipient address
    subject: "Confirm Your Email", // Email subject
    html: `
      <p>Thank you for registering! Please confirm your email by entering the following 6-digit code:</p>
      <h2>${code}</h2>
      <p>If you did not request this, please ignore this email.</p>
    `, // Email content (HTML)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

/**
 * Sends a password reset email with a reset link.
 * @param {string} email - The recipient's email address.
 * @param {string} resetUrl - The password reset URL.
 */
export const sendPasswordResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};