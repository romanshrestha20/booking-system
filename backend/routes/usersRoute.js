import express from "express";
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  getUserByEmailController,
  updateUserController,
  deleteUserController,
  loginUserController,
  confirmCodeController,
  resendEmailController,
  requestPasswordResetController,
  resetPasswordController,
} from "../controllers/userController.js";

const router = express.Router();

// Authentication Routes
router.post("/auth/register", createUserController); // Register a new user
router.post("/auth/login", loginUserController); // Login a user
router.post("/auth/confirm-email", confirmCodeController); // Confirm email with a 6-digit code
router.post("/auth/resend-email", resendEmailController); // Resend confirmation email
router.post("/auth/reset-password", requestPasswordResetController); // Request password reset
router.post("/auth/reset-password/:token", resetPasswordController); // Reset password with a token

// User Routes
router.get("/users", getUsersController); // Get all users
router.get("/users/:user_id", getUserByIdController); // Get a user by ID
router.get("/users/email/:email", getUserByEmailController); // Get a user by email
router.put("/users/:user_id", updateUserController); // Update a user by ID
router.delete("/users/:user_id", deleteUserController); // Delete a user by ID

// Logout Route
router.post("/auth/logout", (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
});

export default router;