import pool from "../db.js";

// Get all rooms
export const getRooms = async () => {
  try {
    const result = await pool.query("SELECT * FROM Rooms");
    return result.rows;
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
    throw error;
  }
};

// Create a new room
export const createRoom = async (room) => {
  const { room_number, type, price, is_available, description } = room;
  try {
    const result = await pool.query(
      "INSERT INTO Rooms (room_number, type, price, is_available, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [room_number, type, price, is_available, description]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL error code for unique violation
      throw new Error("Room number already exists");
    }
    throw error;
  }
};

// Update a room by ID
export const updateRoom = async (room_id, room) => {
  const { room_number, type, price, is_available, description } = room;
  try {
    const result = await pool.query(
      "UPDATE Rooms SET room_number = $1, type = $2, price = $3, is_available = $4, description = $5 WHERE room_id = $6 RETURNING *",
      [room_number, type, price, is_available, description, room_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Delete a room by ID
export const deleteRoom = async (room_id) => {
  try {
    await pool.query("DELETE FROM Rooms WHERE room_id = $1", [room_id]);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
