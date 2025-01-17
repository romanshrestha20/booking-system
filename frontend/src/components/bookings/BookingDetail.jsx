import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBookingById,
  deleteBooking,
  updateBooking,
} from "../../services/bookingApi";
import { getUserById } from "../../services/userApi";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    check_in_date: "",
    check_out_date: "",
    total_price: "",
    status: "",
    user_id: "",
    room_id: "",
  });

  const { user } = useAuth(); // Get the current user from AuthContext

  useEffect(() => {
    async function fetchBooking() {
      try {
        const data = await getBookingById(bookingId);
        const user = await getUserById(data.booking.user_id);
        data.booking.guest_name = user.user.name;

        if (data.booking) {
          setBooking(data.booking);
          setFormData({
            check_in_date: data.booking.check_in_date.split("T")[0],
            check_out_date: data.booking.check_out_date.split("T")[0],
            total_price: data.booking.total_price,
            status: data.booking.status,
            user_id: data.booking.user_id,
            room_id: data.booking.room_id,
          });
        } else {
          setError("Booking not found in the response.");
        }

        setMessage(data.message || "Booking details fetched successfully.");
      } catch (err) {
        setError(err.message);
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  const handleDeleteBooking = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      await deleteBooking(bookingId);
      setMessage("Booking deleted successfully!");
      setBooking(null);
      navigate("/bookings");
    } catch (err) {
      setError("Failed to delete booking. Please try again later.");
      console.error("Error deleting booking:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.check_in_date ||
        !formData.check_out_date ||
        !formData.total_price ||
        !formData.status
      ) {
        setError("Please fill out all fields.");
        return;
      }

      if (
        new Date(formData.check_out_date) <= new Date(formData.check_in_date)
      ) {
        setError("Check-out date must be after check-in date.");
        return;
      }

      const payload = {
        ...formData,
        check_in_date: new Date(formData.check_in_date).toISOString(),
        check_out_date: new Date(formData.check_out_date).toISOString(),
      };

      const updatedBooking = await updateBooking(bookingId, payload);
      setBooking(updatedBooking.booking);
      setIsEditing(false);
      setMessage("Booking updated successfully!");
    } catch (err) {
      setError("Failed to update booking. Please try again later.");
      console.error("Error updating booking:", err);
    }
  };

  const toggleEditMode = () => {
    if (user?.role === "admin") {
      setIsEditing(!isEditing);
    }
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Detail</h1>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}
      {booking ? (
        isEditing && user?.role === "admin" ? (
          <form onSubmit={handleEditSubmit} className="space-y-6">
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
                type="number"
                name="total_price"
                value={formData.total_price}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={toggleEditMode}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-700">
              <span className="font-semibold">Booking ID:</span>{" "}
              {booking.booking_id}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Guest Name:</span>{" "}
              {booking.guest_name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Room ID:</span> {booking.room_id}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Check-in Date:</span>{" "}
              {new Date(booking.check_in_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Check-out Date:</span>{" "}
              {new Date(booking.check_out_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total Price:</span> $
              {booking.total_price}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Status:</span> {booking.status}
            </p>

            {/* Only show Edit and Delete buttons if the user is an admin */}
            {user?.role === "admin" && (
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={toggleEditMode}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteBooking}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        <p className="text-gray-700">No booking found.</p>
      )}
    </div>
  );
};

export default BookingDetail;