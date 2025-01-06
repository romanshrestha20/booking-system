import React, { useEffect, useState } from "react";
import { getRooms } from "../../services/roomApi";
import { useNavigate } from "react-router-dom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (err) {
        setError("Failed to fetch rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Rooms</h2>
      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        rooms.map((room) => (
          <div key={room.room_id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <p>Room Number: {room.room_number}</p>
            <p>Type: {room.type}</p>
            <p>Price: ${room.price}</p>
            <p>Availability: {room.is_available ? "Available" : "Not Available"}</p>
            <button onClick={() => navigate(`/rooms/${room.room_id}`)}>View Details</button>
          </div>
        ))
      )}
    </div>
  );
};

export default RoomList;