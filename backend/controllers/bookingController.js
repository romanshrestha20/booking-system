import {
  createBooking,
  getBookings,
  getBookingById,
  getRoomById,
  getUserById,
  getBookingsByUserId,
  getBookingsByRoomId,
  updateBooking,
  deleteBooking,
  isRoomAvailable,
} from "../models/bookings.js";

export const createBookingController = async (req, res) => {
  const {
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    total_price,
    status = "confirmed",
  } = req.body;

  // Validate required fields
  if (
    !user_id ||
    !room_id ||
    !check_in_date ||
    !check_out_date ||
    !total_price
  ) {
    return res.status(400).json({
      error:
        "User ID, room ID, check-in date, check-out date, and total price are required",
    });
  }

  // Validate check-in date is before check-out date
  if (new Date(check_in_date) >= new Date(check_out_date)) {
    return res
      .status(400)
      .json({ error: "Check-in date must be before check-out date" });
  }

  // Validate total_price is a positive number
  if (isNaN(total_price) || total_price <= 0) {
    return res
      .status(400)
      .json({ error: "Total price must be a positive number" });
  }

  // Validate status
  if (status !== "confirmed" && status !== "cancelled") {
    return res
      .status(400)
      .json({ error: 'Status must be either "confirmed" or "cancelled"' });
  }

  try {
    // Check if the user exists
    const user = await getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the room exists
    const room = await getRoomById(room_id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the room is available for the given dates
    const roomAvailable = await isRoomAvailable(room_id, check_in_date, check_out_date);
    if (!roomAvailable) {
      return res.status(409).json({ error: "Room is not available for the selected dates" });
    }

    // Create the booking
    const newBooking = await createBooking({
      user_id,
      room_id,
      check_in_date,
      check_out_date,
      total_price,
      status,
    });
    res.status(201).json({
      message: `Booking created for user ${user_id} in room ${room_id}`,
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookingsController = async (req, res) => {
  try {
    const bookings = await getBookings();
    res.json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookingByIdController = async (req, res) => {
  const booking_id = parseInt(req.params.booking_id);

  // Validate booking_id is a positive integer
  if (isNaN(booking_id) || booking_id <= 0) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  try {
    const booking = await getBookingById(booking_id);
    if (booking) {
      res.json({
        message: "Booking fetched successfully",
        booking,
      });
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  } catch (error) {
    console.error("Error fetching booking:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookingsByUserIdController = async (req, res) => {
  const user_id = req.user_id; // Use the validated user_id from the request object

  // Validate user_id is a positive integer
  if (isNaN(user_id) || user_id <= 0) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const bookings = await getBookingsByUserId(user_id);
    res.json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookingsByRoomIdController = async (req, res) => {
  const room_id = parseInt(req.params.room_id);

  // Validate room_id is a positive integer
  if (isNaN(room_id) || room_id <= 0) {
    return res.status(400).json({ error: "Invalid room ID" });
  }

  try {
    const bookings = await getBookingsByRoomId(room_id);
    if (bookings.length > 0) {
      res.json({
        message: "Bookings fetched successfully",
        bookings,
      });
    } else {
      res.status(404).json({ error: "No bookings found for this room" });
    }
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBookingController = async (req, res) => {
  const booking_id = parseInt(req.params.booking_id);

  // Validate booking_id is a positive integer
  if (isNaN(booking_id) || booking_id <= 0) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  const {
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    total_price,
    status,
  } = req.body;

  // Validate required fields
  if (
    !user_id ||
    !room_id ||
    !check_in_date ||
    !check_out_date ||
    !total_price ||
    !status
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate check-in date is before check-out date
  if (new Date(check_in_date) >= new Date(check_out_date)) {
    return res
      .status(400)
      .json({ error: "Check-in date must be before check-out date" });
  }

  // Validate total_price is a positive number
  if (isNaN(total_price) || total_price <= 0) {
    return res
      .status(400)
      .json({ error: "Total price must be a positive number" });
  }

  // Validate status
  if (status !== "confirmed" && status !== "cancelled") {
    return res
      .status(400)
      .json({ error: 'Status must be either "confirmed" or "cancelled"' });
  }

  try {
    const booking = await getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const updatedBooking = await updateBooking(booking_id, {
      user_id,
      room_id,
      check_in_date,
      check_out_date,
      total_price,
      status,
    });
    res.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBookingController = async (req, res) => {
  const booking_id = parseInt(req.params.booking_id);

  // Validate booking_id is a positive integer
  if (isNaN(booking_id) || booking_id <= 0) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  try {
    await deleteBooking(booking_id);
    res.json({ message: `Booking Id ${booking_id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};