import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);

  const { login, confirmEmail, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();

  // Helper functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Validate email and password
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      await login({ email, password }); // Use the login function from useAuth
      setMessage("Logged in successfully.");
      navigate("/"); // Redirect to the homepage or desired page
    } catch (error) {
      console.log("Login error:", error); // Add a log to check the error object
      if (error?.message === "Please confirm your email to login") {
        setShowConfirmationForm(true);
        setMessage("Your email is not confirmed. Please enter the confirmation code.");
      } else {
        setError(error?.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle email confirmation form submission
  const handleConfirmEmail = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await confirmEmail(email, confirmationCode); // Use the confirmEmail function from useAuth
      setMessage("Email confirmed successfully. You can now log in.");
      setShowConfirmationForm(false);
    } catch (error) {
      console.log("Confirmation error:", error); // Log for debugging
      setError(error?.message || "Failed to confirm email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle resending confirmation code
  const handleResendCode = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resendConfirmationEmail(email); // Use the resendConfirmationEmail function from useAuth
      setMessage("Confirmation email sent. Please check your email.");
    } catch (error) {
      console.log("Resend error:", error); // Log for debugging
      setError(error?.message || "Failed to resend confirmation email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {showConfirmationForm && (
        <div>
          <button
            type="button"
            onClick={() => setShowConfirmationForm(false)}
            disabled={loading}
          >
            Back to Login
          </button>
          <h2>Confirm Your Email</h2>
          <form onSubmit={handleConfirmEmail}>
            <input
              type="text"
              placeholder="Confirmation code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Confirming..." : "Confirm Email"}
            </button>
          </form>
          <p>Didn't receive the code?</p>
          <button type="button" onClick={handleResendCode} disabled={loading}>
            {loading ? "Resending..." : "Resend Code"}
          </button>
        </div>
      )}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        Forgot your password? <Link to="/forgot-password">Reset Password</Link>
      </p>
    </div>
  );
};

export default Login;