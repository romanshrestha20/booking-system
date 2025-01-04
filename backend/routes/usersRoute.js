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
} from "../controllers/userController.js";

const router = express.Router();

// Create a new user
router.post("/register", createUserController);

// Confirm email with 6-digit code
router.post("/confirm-email", confirmCodeController);

// Resend confirmation email with a new 6-digit code
router.post("/resend-email", resendEmailController);

// Login a user
router.post("/login", loginUserController);

// Get all users
router.get("/", getUsersController);

// Get a user by ID
router.get("/:user_id", getUserByIdController);

// Get a user by email
router.get("/email/:email", getUserByEmailController);

// Update a user by ID
router.put("/:user_id", updateUserController);

// Delete a user by ID
router.delete("/:user_id", deleteUserController);

export default router;