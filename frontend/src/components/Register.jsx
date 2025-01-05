import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  registerUser,
  confirmEmail,
  resendConfirmationEmail,
} from "../services/userApi";
import { handleApiError } from "../utils/errorHandler";

const Register = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    code: "",
  });
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState("register"); // "register" or "confirm"
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setMessage(
        "User registered successfully. Please check your email for the confirmation code."
      );
      console.log("Register Response:", response);
      setStep("confirm");
    } catch (error) {
      setError(error.message); // Extract message from the thrown Error object
      console.error("Register Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await confirmEmail(formData.email, formData.code);
      setMessage("Email confirmed successfully. Redirecting to login...");
      console.log("Confirm Email Response:", response);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Confirm Email Error:", error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };
  const handleResendCode = async () => {
    setError("");
    setLoading(true);

    try {
      await resendConfirmationEmail(formData.email);
      setMessage("Confirmation code resent. Please check your email.");
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{step === "register" ? "Register" : "Confirm Email"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {step === "register" && (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </>
      )}

      {step === "confirm" && (
        <form onSubmit={handleConfirmEmail}>
          <input
            type="text"
            name="code"
            placeholder="Confirmation code"
            value={formData.code}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Confirming..." : "Confirm Email"}
          </button>
          <p>Didn't receive the code?</p>
          <button type="button" onClick={handleResendCode} disabled={loading}>
            {loading ? "Resending..." : "Resend Code"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
