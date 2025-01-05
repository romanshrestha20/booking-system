import React from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/userApi";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      console.log("Login Response:", response);
      navigate("/"); // Redirect to home or dashboard
    } catch (error) {
      setError(error.message); // Extract message from the thrown Error object
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        {" "}
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        Forgot your password? <Link to="/forgot-password">Reset Password</Link>
      </p>
    </div>
  );
};

export default Login;
