import nodemailer from "nodemailer";

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send confirmation email
export const sendConfirmationEmail = async (email, code) => {
  // Create the email content
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
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};