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

const router = express.Router();

// Create a new booking
router.post("/", validateBooking, createBookingController);

// Get all bookings
router.get("/", getBookingsController);

// Get a booking by ID
router.get("/:booking_id", validateBookingId, getBookingByIdController);

// Get bookings by user ID
router.get('/user/:user_id', validateUserId, getBookingsByUserIdController);

// Get bookings by room ID
router.get('/room/:room_id', validateRoomId, getBookingsByRoomIdController);

// Update a booking by ID
router.put(
  "/:booking_id",
  validateBookingId,
  validateBooking,
  updateBookingController
);

// Delete a booking by ID
router.delete('/:booking_id', validateBookingId, deleteBookingController);

export default router;