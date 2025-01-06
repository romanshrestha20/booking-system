import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteRoom,
  getRoomById,
  updateRoom,
  getRooms,
} from "../../services/roomApi"; // Import getRooms
import { getUsers } from "../../services/userApi"; // Import getUsers
import BookingForm from "../bookings/BookingForm";

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    room_number: "",
    type: "",
    price: "",
    is_available: true,
    description: "",
  });
  const [availableRooms, setAvailableRooms] = useState([]); // State for available rooms
  const [users, setUsers] = useState([]); // State for users

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomById(roomId);
        setRoom(data.room);
        setFormData(data.room);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableRoomsAndUsers = async () => {
      try {
        const roomsData = await getRooms(); // Fetch all rooms
        const availableRooms = roomsData.filter((room) => room.is_available); // Filter available rooms
        setAvailableRooms(availableRooms);

        const usersData = await getUsers(); // Fetch users
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to fetch available rooms or users:", err);
      }
    };

    fetchRoom();
    fetchAvailableRoomsAndUsers();
  }, [roomId]);

  const handleEditRoom = async () => {
    try {
      const updatedRoom = await updateRoom(roomId, formData);
      setRoom(updatedRoom.room);
      setIsEditing(false);
      setMessage("Room updated successfully!");
    } catch (err) {
      setError("Failed to update room. Please try again later.");
      console.error(err);
    }
  };

  const handleDeleteRoom = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (confirmDelete) {
      try {
        if (!room.is_available) {
          setError("Cannot delete a room that is not available.");
          return;
        }
        await deleteRoom(roomId);
        setMessage("Room deleted successfully!");
        navigate("/rooms");
      } catch (err) {
        setError("Failed to delete room. Please try again later.");
        console.error(err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (loading) return <div>Loading...</div>;


  return (
    <div>
      <h1>Room {room.room_number}</h1>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      {/* if room not found */}
      {!room && <p>Room not found.</p>}
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditRoom();
          }}
        >
          <div>
            <label>Room Number:</label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Type:</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Availability:</label>
            <select
              name="is_available"
              value={formData.is_available}
              onChange={handleInputChange}
            >
              <option value={true}>Available</option>
              <option value={false}>Not Available</option>
            </select>
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={toggleEditMode}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p>Type: {room.type}</p>
          <p>Price: ${room.price}</p>
          <p>
            Availability: {room.is_available ? "Available" : "Not Available"}
          </p>
          <p>Description: {room.description}</p>
          <div>
            {room.is_available && (
              <BookingForm
                roomId={roomId}
                availableRooms={availableRooms} // Pass available rooms
                users={users} // Pass users
                onBookingSuccess={(message) => {
                  setMessage(message);
                  setRoom((prevRoom) => ({ ...prevRoom, is_available: false }));
                }}
                onBookingError={(error) => setError(error)}
              />
            )}
            <button onClick={toggleEditMode}>Edit</button>
            <button onClick={handleDeleteRoom}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomDetail;
