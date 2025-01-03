import pool from "../db.js";

// Create a new booking
export const createBooking = async (booking) => {
  const {
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    total_price,
    status = "confirmed",
  } = booking;

  try {
    const result = await pool.query(
      "INSERT INTO Bookings (user_id, room_id, check_in_date, check_out_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, room_id, check_in_date, check_out_date, total_price, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating booking:", error.message);
    throw error;
  }
};

// Get all bookings
export const getBookings = async () => {
  try {
    const result = await pool.query("SELECT * FROM Bookings");
    return result.rows;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw error;
  }
};

// Get a booking by ID
export const getBookingById = async (booking_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Bookings WHERE booking_id = $1",
      [booking_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching booking by ID:", error.message);
    throw error;
  }
};

// Get a room by ID
export const getRoomById = async (room_id) => {
  try {
    const result = await pool.query("SELECT * FROM Rooms WHERE room_id = $1", [
      room_id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching room by ID:", error.message);
    throw error;
  }
};

// Get a user by ID
export const getUserById = async (user_id) => {
  try {
    const result = await pool.query("SELECT * FROM Users WHERE user_id = $1", [
      user_id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    throw error;
  }
};

// Get bookings by user ID
export const getBookingsByUserId = async (user_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Bookings WHERE user_id = $1",
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching bookings by user ID:", error.message);
    throw error;
  }
};

// Get bookings by room ID
export const getBookingsByRoomId = async (room_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Bookings WHERE room_id = $1",
      [room_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching bookings by room ID:", error.message);
    throw error;
  }
};

// Update a booking by ID
export const updateBooking = async (booking_id, booking) => {
  const {
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    total_price,
    status,
  } = booking;

  try {
    const result = await pool.query(
      "UPDATE Bookings SET user_id = $1, room_id = $2, check_in_date = $3, check_out_date = $4, total_price = $5, status = $6 WHERE booking_id = $7 RETURNING *",
      [user_id, room_id, check_in_date, check_out_date, total_price, status, booking_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating booking:", error.message);
    throw error;
  }
};

// Delete a booking by ID
export const deleteBooking = async (booking_id) => {
  try {
    await pool.query("DELETE FROM Bookings WHERE booking_id = $1", [booking_id]);
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    throw error;
  }
};


export const isRoomAvailable = async (room_id, check_in_date, check_out_date) => {
  if (!Number.isInteger(room_id) || room_id <= 0) {
    throw new Error('Invalid room ID');
  }
  if (!Date.parse(check_in_date) || !Date.parse(check_out_date)) {
    throw new Error('Invalid date format');
  }

  try {
    const result = await pool.query(
      `SELECT * FROM Bookings 
       WHERE room_id = $1 
       AND (
         (check_in_date <= $2 AND check_out_date >= $2) OR 
         (check_in_date <= $3 AND check_out_date >= $3) OR 
         (check_in_date >= $2 AND check_out_date <= $3)
       )`,
      [room_id, check_in_date, check_out_date]
    );
    return result.rows.length === 0;
  } catch (error) {
    console.error("Error checking room availability:", error.message);
    throw error;
  }
};
