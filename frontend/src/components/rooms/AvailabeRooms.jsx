import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../services/roomApi"; // Import the getRooms function
import BookingForm from "../bookings/BookingForm"; // Import the BookingForm component

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]); // State to store all rooms
  const [availableRooms, setAvailableRooms] = useState([]); // State to store available rooms
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRooms(); // Fetch all rooms
        setRooms(roomsData); // Set all rooms in state
        // Filter available rooms
        const available = roomsData.filter((room) => room.is_available);
        setAvailableRooms(available); // Set available rooms in state
      } catch (error) {
        setError("Failed to fetch available rooms. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchRooms();
  }, []);

  // Filter rooms based on search query
  const filteredRooms = availableRooms.filter((room) =>
    room.room_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle booking success
  const handleBookingSuccess = (message, roomId) => {
    alert(message); // Show success message
    // Optionally, refresh the list of available rooms
    const updatedAvailableRooms = availableRooms.filter(
      (room) => room.room_id !== roomId
    );
    setAvailableRooms(updatedAvailableRooms);
  };

  // Handle booking error
  const handleBookingError = (error) => {
    console.error("Booking Error:", error);
    alert("Failed to book the room. Please try again.");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Rooms</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by room number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.room_id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Room {room.room_number}
                </h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Type:</span> {room.type}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Price:</span> ${room.price} per
                  night
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Description:</span>{" "}
                  {room.description}
                </p>
                <button
                  onClick={() => navigate(`/rooms/${room.room_id}`)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 mb-4"
                >
                  View Details
                </button>
                <BookingForm
                  roomId={room.room_id}
                  onBookingSuccess={(message) => handleBookingSuccess(message, room.room_id)}
                  onBookingError={handleBookingError}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No available rooms found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;