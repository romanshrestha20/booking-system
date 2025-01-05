/**
 * Handles API errors and throws a consistent error message.
 * @param {Error} error - The error object from the API call.
 * @throws {string} - A user-friendly error message.
 */
export const handleApiError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
  
      if (status === 401) {
        throw "Unauthorized: Please log in.";
      } else if (status === 404) {
        throw "Resource not found.";
      } else if (status === 500) {
        throw "Server error. Please try again later.";
      } else {
        // Use the error message from the server if available
        throw data?.error || "An error occurred while processing your request.";
      }
    } else if (error.request) {
      // The request was made but no response was received
      // throw "Network error. Please check your connection.";
      throw error.message;
      
    } else {
      // Something happened in setting up the request that triggered an error
      throw error.message;
    }
  };