import React, { useState, useEffect } from "react";
import { createBooking } from "../../services/bookingApi";
import { getUsers } from "../../services/userApi"; // Import getUsers function
import { getRoomById } from "../../services/roomApi"; // Import getRoomById function
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext

const BookingForm = ({ roomId, onBookingSuccess, onBookingError }) => {
  const { user: loggedInUser } = useAuth(); // Get the logged-in user
  const [formData, setFormData] = useState({
    user_id: loggedInUser?.user_id || "", // Pre-fill user_id if logged in
    guest_name: loggedInUser?.role !== "admin" ? loggedInUser?.name : "", // Pre-fill guest_name if not admin
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
        // Fetch users (only if the logged-in user is an admin)
        if (loggedInUser?.role === "admin") {
          const usersResponse = await getUsers();
          console.log("Users API Response:", usersResponse); // Debugging: Log the response
          if (usersResponse.users && Array.isArray(usersResponse.users)) {
            setUsers(usersResponse.users); // Set the users array from the response
          } else {
            console.error("Invalid users data format:", usersResponse);
            setUsers([]); // Fallback to an empty array
          }
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
  }, [roomId, loggedInUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGuestChange = (e) => {
    const selectedUserId = e.target.value;
    if (!selectedUserId) return setFormData((prevData) => ({ ...prevData, user_id: "", guest_name: "" }));
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {loggedInUser?.role === "admin" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Guest Name:
          </label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleGuestChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a guest</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      )}
      {loggedInUser?.role !== "admin" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Guest Name:
          </label>
          <input
            type="text"
            name="guest_name"
            value={formData.guest_name}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Check-in Date:
        </label>
        <input
          type="date"
          name="check_in_date"
          value={formData.check_in_date}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Check-out Date:
        </label>
        <input
          type="date"
          name="check_out_date"
          value={formData.check_out_date}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Total Price:
        </label>
        <input
          type="text"
          name="total_price"
          value={formData.total_price || "Calculating..."}
          readOnly
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? "Booking..." : "Book Room"}
      </button>
    </form>
  );
};

export default BookingForm;