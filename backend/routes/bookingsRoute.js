import express from 'express';
import {
  createBookingController,
  getBookingsController,
  getBookingByIdController,
  getBookingsByUserIdController,
  getBookingsByRoomIdController,
  updateBookingController,
  deleteBookingController,
} from '../controllers/bookingController.js';

import {
  validateBooking,
  validateBookingId,
  validateUserId,
  validateRoomId,
} from "../middlewares/bookingValidation.js";

import { authenticateUser, authorizeUser } from "../middlewares/authMiddleware.js"; // Import middleware

const router = express.Router();

// Create a new booking (Authenticated users only)
router.post("/", authenticateUser, validateBooking, createBookingController);

// Get all bookings (Admin only)
router.get("/", authenticateUser, authorizeUser(["admin"]), getBookingsController);

// Get a booking by ID (Authenticated users only)
router.get("/:booking_id", authenticateUser, validateBookingId, getBookingByIdController);

// Get bookings by user ID (Authenticated users only)
router.get('/user/:user_id', authenticateUser, validateUserId, getBookingsByUserIdController);

// Get bookings by room ID (Authenticated users only)
router.get('/room/:room_id', authenticateUser, validateRoomId, getBookingsByRoomIdController);

// Update a booking by ID (Authenticated users only)
router.put(
  "/:booking_id",
  authenticateUser,
  validateBookingId,
  validateBooking,
  updateBookingController
);

// Delete a booking by ID (Admin only)
router.delete('/:booking_id', authenticateUser, authorizeUser(["admin"]), validateBookingId, deleteBookingController);

export default router;