import bcrypt from "bcrypt";
import crypto from "crypto";

// Hash a password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Generate a 6-digit confirmation code
export const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate a reset token
export const generateResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
};