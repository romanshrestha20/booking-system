import express from 'express';
import {
  createBookingController,
  getBookingsController,
  getBookingByIdController,
  getBookingsByUserIdController,
  getBookingsByRoomIdController,
  updateBookingController,
  deleteBookingController,
} from '../controllers/bookings.js';

const router = express.Router();

// Create a new booking
router.post('/', createBookingController);

// Get all bookings
router.get('/', getBookingsController);

// Get a booking by ID
router.get('/:booking_id', getBookingByIdController);

// Get bookings by user ID
router.get('/user/:user_id', getBookingsByUserIdController);

// Get bookings by room ID
router.get('/room/:room_id', getBookingsByRoomIdController);

// Update a booking by ID
router.put('/:booking_id', updateBookingController);

// Delete a booking by ID
router.delete('/:booking_id', deleteBookingController);

export default router;