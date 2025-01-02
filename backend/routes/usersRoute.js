import express from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  getUserByEmailController,
  updateUserController,
  deleteUserController,
} from "../controllers/users.js";

const router = express.Router();

// Create a new user
router.post("/", createUserController);

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