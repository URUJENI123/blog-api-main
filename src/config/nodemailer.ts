import nodemailer from "nodemailer";

// Function to create transporter
export async function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing email credentials");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // This ensures a secure connection
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Verify the transporter configuration
    await transporter.verify();
    console.log("Email transporter successfully verified.");
  } catch (error) {
    console.error("Email configuration nodemailer error:", error);
    throw new Error(
      "Failed to connect to email service. Please check your email configurations."
    );
  }

  return transporter;
}

// Function to send verification email
export async function sendVerificationEmail(email: string, link: string) {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Welcome to Our Service!</h2>
      <p>Click the link below to verify your email:</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
    throw new Error(
      "Failed to send verification email. Please try again later."
    );
  }
}

// Function to send password reset email
export const sendResetPasswordEmail = async (
  email: string,
  resetLink: string
) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send reset email to ${email}:`, error);
    throw new Error(
      "Failed to send reset password email. Please try again later."
    );
  }
};
