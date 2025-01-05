import React, { useState } from "react";
import api from "./api"; // Your Axios instance

const TestAPI = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const testRegister = async () => {
    try {
      const userData = { email: "test@example.com", password: "password123" };
      const result = await api.post("/users/register", userData);
      setResponse(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const testLogin = async () => {
    try {
      const credentials = { email: "test@example.com", password: "password123" };
      const result = await api.post("/users/login", credentials);
      setResponse(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const testProtectedEndpoint = async () => {
    try {
      const result = await api.get("/users/me"); // Example protected endpoint
      setResponse(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <div>
      <h1>API Testing</h1>
      <button onClick={testRegister}>Test Register</button>
      <button onClick={testLogin}>Test Login</button>
      <button onClick={testProtectedEndpoint}>Test Protected Endpoint</button>

      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestAPI;