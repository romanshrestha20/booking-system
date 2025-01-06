import express from 'express';
import {
    getRoomsController,
    getRoomByIdController,
    createRoomController,
    updateRoomController,
    deleteRoomController,
} from '../controllers/roomController.js';

import {
    authenticateUser,
    authorizeUser
} from "../middlewares/authMiddleware.js"
const router = express.Router();

// Get all rooms (Public)
router.get('/', getRoomsController);

// Get a room by ID (Public)
router.get('/:room_id', getRoomByIdController);

// Create a new room (Admin only)
router.post('/', authenticateUser, authorizeUser(["admin"]), createRoomController);

// Update a room by ID (Admin only)
router.put('/:room_id', authenticateUser, authorizeUser(["admin"]), updateRoomController);

// Delete a room by ID (Admin only)
router.delete('/:room_id', authenticateUser, authorizeUser(["admin"]), deleteRoomController);

export default router;