import React, { useState, useEffect } from "react";
import { createBooking } from "../../services/bookingApi";
import { getUsers } from "../../services/userApi"; // Import getUsers function
import { getRoomById } from "../../services/roomApi"; // Import getRoomById function

const BookingForm = ({ roomId, onBookingSuccess, onBookingError }) => {
  const [formData, setFormData] = useState({
    user_id: "", // Add user_id to form data
    guest_name: "",
    check_in_date: "",
    check_out_date: "",
    total_price: "", // Add total_price to form data
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]); // State to store the list of users
  const [room, setRoom] = useState(null); // State to store room details

  // Fetch users and room details on component mount
  useEffect(() => {
    const fetchUsersAndRoom = async () => {
      try {
        // Fetch users
        const usersResponse = await getUsers();
        console.log("Users API Response:", usersResponse); // Debugging: Log the response
        if (usersResponse.users && Array.isArray(usersResponse.users)) {
          setUsers(usersResponse.users); // Set the users array from the response
        } else {
          console.error("Invalid users data format:", usersResponse);
          setUsers([]); // Fallback to an empty array
        }

        // Fetch room details
        if (!roomId || isNaN(roomId) || roomId <= 0) {
          setError("Invalid room ID. Please try again.");
          return;
        }

        const roomResponse = await getRoomById(roomId);
        console.log("Room API Response:", roomResponse); // Debugging: Log the response
        if (roomResponse.room) {
          setRoom(roomResponse.room); // Set the room details
        } else {
          console.error("Invalid room data format:", roomResponse);
          setError("Room not found. Please try again.");
        }
      } catch (err) {
        console.error("Failed to fetch users or room details:", err);
        setUsers([]); // Set users to an empty array if the API call fails
        setError("Failed to fetch room details. Please try again later.");
      }
    };

    fetchUsersAndRoom();
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGuestChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users.find((user) => user.user_id === parseInt(selectedUserId));
    setFormData((prevData) => ({
      ...prevData,
      user_id: selectedUserId,
      guest_name: selectedUser ? selectedUser.name : "",
    }));
  };

  const calculateTotalPrice = (checkInDate, checkOutDate) => {
    if (!room || !checkInDate || !checkOutDate) return 0;

    const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const days = Math.round(Math.abs((endDate - startDate) / oneDay));

    return (days * parseFloat(room.price)).toFixed(2); // Calculate total price
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate room ID
    if (!roomId || isNaN(roomId) || roomId <= 0) {
      setError("Invalid room ID. Please try again.");
      setLoading(false);
      return;
    }

    // Validate check-in and check-out dates
    if (new Date(formData.check_in_date) >= new Date(formData.check_out_date)) {
      setError("Check-out date must be after check-in date.");
      setLoading(false);
      return;
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(formData.check_in_date, formData.check_out_date);
    setFormData((prevData) => ({
      ...prevData,
      total_price: totalPrice,
    }));

    try {
      const bookingData = {
        room_id: parseInt(roomId), // Ensure room_id is an integer
        user_id: parseInt(formData.user_id), // Ensure user_id is an integer
        guest_name: formData.guest_name,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        total_price: parseFloat(totalPrice), // Ensure total_price is a number
      };
      console.log("Booking Payload:", bookingData); // Debugging: Log the payload
      await createBooking(bookingData);
      onBookingSuccess("Room booked successfully!");
    } catch (err) {
      console.error("Booking Error:", err.response?.data); // Debugging: Log the error response
      setError(err.response?.data?.errors?.map((e) => e.msg).join(", ") || "Failed to book room. Please try again later.");
      onBookingError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Guest Name:</label>
        <select
          name="user_id"
          value={formData.user_id}
          onChange={handleGuestChange}
          required
        >
          <option value="">Select a guest</option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Check-in Date:</label>
        <input
          type="date"
          name="check_in_date"
          value={formData.check_in_date}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Check-out Date:</label>
        <input
          type="date"
          name="check_out_date"
          value={formData.check_out_date}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Total Price:</label>
        <input
          type="text"
          name="total_price"
          value={formData.total_price || "Calculating..."}
          readOnly
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Booking..." : "Book Room"}
      </button>
    </form>
  );
};

export default BookingForm;