import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBookingById,
  deleteBooking,
  updateBooking,
} from "../../services/bookingApi";
import { getUserById } from "../../services/userApi";

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
    setIsEditing(!isEditing);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
      <h1>Booking Detail</h1>
      {message && <p>{message}</p>}
      {booking ? (
        isEditing ? (
          <form onSubmit={handleEditSubmit}>
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
                type="number"
                name="total_price"
                value={formData.total_price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={toggleEditMode}>
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <p>Booking ID: {booking.booking_id}</p>
            <p>Guest Name: {booking.guest_name}</p>
            <p>Room ID: {booking.room_id}</p>
            <p>
              Check-in Date:{" "}
              {new Date(booking.check_in_date).toLocaleDateString()}
            </p>
            <p>
              Check-out Date:{" "}
              {new Date(booking.check_out_date).toLocaleDateString()}
            </p>
            <p>Total Price: ${booking.total_price}</p>
            <p>Status: {booking.status}</p>

            <div>
              <button onClick={toggleEditMode}>Edit</button>
              <button onClick={handleDeleteBooking}>Delete</button>
            </div>
          </div>
        )
      ) : (
        <p>No booking found</p>
      )}
    </div>
  );
};

export default BookingDetail;
