import express from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  getUserByEmailController,
  updateUserController,
  deleteUserController,
  loginUserController
} from "../controllers/userController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import {
  validateCreateUser,
  validateUserId,
  validateUpdateUser,
} from "../middlewares/userValidation.js";

const router = express.Router();

// Create a new user
router.post("/", validateCreateUser, createUserController);

// Login a user
router.post("/login", loginUserController);

// Get all users (protected)
router.get("/", authenticateUser, getUsersController);

// Get a user by ID (protected)
router.get("/:user_id", authenticateUser, validateUserId, getUserByIdController);

// Get a user by email
router.get("/email/:email", getUserByEmailController);

// Update a user by ID (protected)
router.put("/:user_id", authenticateUser, validateUserId, validateUpdateUser, updateUserController);

// Delete a user by ID (protected)
router.delete("/:user_id", authenticateUser, validateUserId, deleteUserController);

export default router;
