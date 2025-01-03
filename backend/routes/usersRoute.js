import express from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  getUserByEmailController,
  updateUserController,
  deleteUserController,
} from "../controllers/userController.js";

import {
  validateCreateUser,
  validateUserId,
  validateUpdateUser,
} from "../middlewares/userValidation.js";

const router = express.Router();

// Create a new user
router.post("/", validateCreateUser, createUserController);

// Get all users
router.get("/", getUsersController);

// Get a user by ID
router.get("/:user_id", validateUserId, getUserByIdController);

// Get a user by email
router.get("/email/:email", getUserByEmailController);

// Update a user by ID
router.put(
  "/:user_id",
  [validateUserId, validateUpdateUser],
  updateUserController
);

// Delete a user by ID
router.delete("/:user_id", validateUserId, deleteUserController);

export default router;