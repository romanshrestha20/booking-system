import {
  getRoomById,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../models/rooms.js";

// Get all rooms
export const getRoomsController = async (req, res) => {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a room by ID
export const getRoomByIdController = async (req, res) => {
  const room_id = parseInt(req.params.room_id); // Use room_id instead of id
  if (isNaN(room_id) || room_id <= 0) {
    return res.status(400).json({ error: "Invalid room ID" });
  }

  try {
    const room = await getRoomById(room_id);
    if (room) {
      res.json({ message: "Room found", room: room });
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.error("Error fetching room:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new room
export const createRoomController = async (req, res) => {
  const room = req.body;

  // Validate required fields
  if (
    !room.room_number ||
    !room.type ||
    !room.price ||
    room.is_available === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newRoom = await createRoom(room);
    res.status(201).json({ message: "Room created", room: newRoom });
  } catch (error) {
    if (error.message === "Room number already exists") {
      res.status(409).json({ error: error.message });
    } else {
      console.error("Error creating room:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
};

// Update a room by ID
export const updateRoomController = async (req, res) => {
  const room_id = parseInt(req.params.room_id); // Use room_id instead of id
  if (isNaN(room_id) || room_id <= 0) {
    return res.status(400).json({ error: "Invalid room ID" });
  }

  const room = req.body;

  // Validate required fields
  if (
    !room.room_number ||
    !room.type ||
    !room.price ||
    room.is_available === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updatedRoom = await updateRoom(room_id, room);
    if (updatedRoom) {
      res.json({
        message: "Room updated",
        room: updatedRoom,
      });
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.error("Error updating room:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a room by ID
export const deleteRoomController = async (req, res) => {
  const room_id = parseInt(req.params.room_id); // Use room_id instead of id

  // Validate room_id is a positive integer
  if (isNaN(room_id) || room_id <= 0) {
    return res.status(400).json({ error: "Invalid room ID" });
  }

  try {
    // Check if the room exists
    const room = await getRoomById(room_id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Delete the room
    await deleteRoom(room_id);
    res.status(204).send(); // Send a 204 (No Content) response for successful deletion
  } catch (error) {
    console.error("Error deleting room:", error.message);
    res.status(500).json({ error: "Server error" }); // Send a structured error response
  }
};
