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
import { authenticateUser, authorizeUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Authentication Routes (Public)
router.post("/auth/register", createUserController); // Register a new user
router.post("/auth/login", loginUserController); // Login a user
router.post("/auth/confirm-email", confirmCodeController); // Confirm email with a 6-digit code
router.post("/auth/resend-email", resendEmailController); // Resend confirmation email
router.post("/auth/reset-password", requestPasswordResetController); // Request password reset
router.post("/auth/reset-password/:token", resetPasswordController); // Reset password with a token

// User Routes (Protected)
router.get("/users", authenticateUser, authorizeUser(["admin"]), getUsersController); // Get all users (Admin only)
router.get("/users/:user_id", authenticateUser, getUserByIdController); // Get a user by ID (Authenticated users)
router.get("/users/email/:email", authenticateUser, getUserByEmailController); // Get a user by email (Authenticated users)
router.put("/users/:user_id", authenticateUser, updateUserController); // Update a user by ID (Authenticated users)
router.delete("/users/:user_id", authenticateUser, authorizeUser(["admin"]), deleteUserController); // Delete a user by ID (Admin only)

// Logout Route (Public)
router.post("/auth/logout", (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
});

export default router;