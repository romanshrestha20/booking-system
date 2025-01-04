import {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "../models/users.js";
import { sendConfirmationEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // Ensure pool is imported

// Create a new user
export const createUserController = async (req, res) => {
  const { name, email, password, role = "customer" } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  // Normalize email to lowercase
  const normalizedEmail = email.toLowerCase();

  // Validate role
  if (role !== "admin" && role !== "customer") {
    return res
      .status(400)
      .json({ error: 'Role must be either "admin" or "customer"' });
  }

  try {
    // Create the user in the database
    const newUser = await createUser({
      name,
      email: normalizedEmail,
      password,
      role,
    });

    // Send confirmation email with the 6-digit code
    await sendConfirmationEmail(normalizedEmail, newUser.confirmation_code);

    // If email is sent successfully, return success response
    res.status(201).json({
      message:
        "User created. Please check your email for the confirmation code.",
      user: newUser,
    });
    console.log("Confirmation code: " + newUser.confirmation_code);
  } catch (error) {
    console.error("Error during user creation:", error.message);

    // If the error is related to email sending, delete the user
    if (error.message.includes("Error sending confirmation email")) {
      try {
        // Delete the user if the email fails to send
        await deleteUser(newUser.user_id);
        console.log("User deleted due to email sending failure.");
      } catch (deleteError) {
        console.error("Error deleting user:", deleteError.message);
      }
    }

    // Return appropriate error response
    if (error.message === "Email already exists") {
      res.status(409).json({ error: error.message });
    } else if (error.message.includes("Error sending confirmation email")) {
      res.status(500).json({
        error: "Failed to send confirmation email. Account not created.",
      });
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
    const user = await getUserByEmail(email.toLowerCase());

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.is_confirmed) {
      return res.status(400).json({ error: "Email already confirmed" });
    }

    if (user.confirmation_code !== code) {
      return res.status(400).json({ error: "Invalid confirmation code" });
    }

    // Mark the user as confirmed
    await pool.query(
      "UPDATE Users SET is_confirmed = true, confirmation_code = NULL WHERE user_id = $1",
      [user.user_id]
    );

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
    const user = await getUserByEmail(email.toLowerCase());

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.is_confirmed) {
      return res.status(400).json({ error: "Email already confirmed" });
    }

    // Generate a new 6-digit confirmation code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query(
      "UPDATE Users SET confirmation_code = $1 WHERE user_id = $2",
      [newCode, user.user_id]
    );

    // Send confirmation email with the new code
    await sendConfirmationEmail(email, newCode);

    res.json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    console.error("Error resending confirmation email:", error.message);
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
