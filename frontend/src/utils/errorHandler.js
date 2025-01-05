/**
 * Handles API errors and throws a consistent error message.
 * @param {Error} error - The error object from the API call.
 * @throws {Error} - A user-friendly error object.
 */
export const handleApiError = (error) => {
  console.error("API Error:", error); // Log the raw error for debugging

  if (error.response) {
    // The server responded with a status code outside the 2xx range
    const { status, data } = error.response;

    switch (status) {
      case 401:
        throw new Error("Unauthorized: Please log in.");
      case 404:
        throw new Error("Resource not found.");
      case 500:
        throw new Error("Server error. Please try again later.");
      default:
        // Use the server-provided error message if available
        throw new Error(data?.error || "An error occurred while processing your request.");
    }
  } else if (error.request) {
    // No response was received
    console.error("No response received:", error.request);
    throw new Error("Network error. Please check your connection.");
  } else {
    // Error occurred in setting up the request
    console.error("Request setup error:", error.message);
    throw new Error(error.message || "An unexpected error occurred.");
  }
};
