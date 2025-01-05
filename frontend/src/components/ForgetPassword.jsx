import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { requestPasswordReset, loading } = useAuth(); // Use requestPasswordReset and loading from useAuth

  // Validate the email format
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    if (!email) {
      setError("Email is required.");
      return;
    }


    try {
      const response = await requestPasswordReset(email);
      setSuccess(response.message); // Use response.message for success message
    } catch (error) {
      setError(error.message || "Failed to send password reset email. Please try again."); // Display error message
      }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Forgot Password</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleForgetPassword}>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {/* Display error message */}
                {error && <div className="alert alert-danger">{error}</div>}
                {/* Display success message */}
                {success && <div className="alert alert-success">{success}</div>}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>{" "}
                      Sending...
                    </>
                  ) : (
                    "Send Password Reset Email"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
