import {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  confirmEmail,
  updateConfirmationCode,
  requestPasswordReset,
  resetPassword,
} from "../models/users.js";
import {
  sendPasswordResetEmail,
  sendConfirmationEmail,
} from "../utils/sendEmail.js";
import {
  hashPassword,
  generateSixDigitCode,
  generateResetToken,
} from "../utils/helpers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const baseUrl = "http://localhost:3000"; // Change this to your frontend URL

// Create a new user
export const createUserController = async (req, res) => {
  const { name, email, password, role = "customer" } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  // Normalize email
  const normalizedEmail = email.toLowerCase();

  // Validate role
  if (role !== "admin" && role !== "customer") {
    return res
      .status(400)
      .json({ error: 'Role must be either "admin" or "customer"' });
  }

  try {
    const confirmationCode = generateSixDigitCode();

    // Create the user in the database
    const newUser = await createUser({
      name,
      email: normalizedEmail,
      password,
      role,
      confirmationCode,
    });

    // Send confirmation email
    await sendConfirmationEmail(normalizedEmail, confirmationCode);

    res.status(201).json({
      message:
        "User created. Please check your email for the confirmation code.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during user creation:", error.message);

    if (error.message === "Email already exists") {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

// Confirm email with 6-digit code
export const confirmCodeController = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  try {
    const user = await confirmEmail(code);

    if (!user) {
      return res.status(404).json({ error: "Invalid code" });
    }

    res.json({ message: "Email confirmed successfully" });
  } catch (error) {
    console.error("Error confirming email:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Resend confirmation email with a new 6-digit code
export const resendEmailController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.is_confirmed) {
      return res.status(400).json({ error: "Email already confirmed" });
    }

    const newCode = generateSixDigitCode();
    await updateConfirmationCode(email, newCode);

    // Send confirmation email with the new code
    await sendConfirmationEmail(email, newCode);

    res.json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    console.error("Error resending confirmation email:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Request password reset.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export const requestPasswordResetController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await requestPasswordReset(email, resetToken, resetTokenExpires);

    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    res.json({ message: "Password reset instructions sent to your email." });
  } catch (error) {
    console.error("Error requesting password reset:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Reset password.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
export const resetPasswordController = async (req, res) => {
  const { token } = req.params; // Extract token from the URL
  const { password } = req.body; // Extract password from the request body

  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  try {
    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update the user's password in the database
    const user = await resetPassword(token, hashedPassword);

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
// Login a user and return a JWT
export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if email is confirmed
    if (!user.is_confirmed) {
      return res
        .status(403)
        .json({ error: "Please confirm your email to login" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Shorter expiry for better security
    );

    res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all users
export const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();
    res.json({
      message: "Users fetched",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a user by ID
export const getUserByIdController = async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  // Validate user_id is a positive integer
  if (isNaN(user_id) || user_id <= 0) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await getUserById(user_id);
    if (user) {
      res.json({
        message: "User fetched",
        user,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a user by email
export const getUserByEmailController = async (req, res) => {
  const { email } = req.query;

  // Validate email is provided
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await getUserByEmail(email.toLowerCase());
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a user by ID
export const updateUserController = async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  // Validate user_id is a positive integer
  if (isNaN(user_id) || user_id <= 0) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  // Normalize email to lowercase
  const normalizedEmail = email.toLowerCase();

  // Validate role
  if (role && role !== "admin" && role !== "customer") {
    return res
      .status(400)
      .json({ error: 'Role must be either "admin" or "customer"' });
  }

  try {
    const updatedUser = await updateUser(user_id, {
      name,
      email: normalizedEmail,
      password,
      role,
    });
    if (updatedUser) {
      res.json({
        message: "User updated",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    if (error.message === "Email already exists") {
      res.status(409).json({ error: error.message });
    } else {
      console.error("Error updating user:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
};

// Delete a user by ID
export const deleteUserController = async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  // Validate user_id is a positive integer
  if (isNaN(user_id) || user_id <= 0) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await deleteUser(user_id);
    res.json({
      message: `User (${user_id}) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
