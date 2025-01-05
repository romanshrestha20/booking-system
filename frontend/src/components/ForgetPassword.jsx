import React, { useState } from "react";
import { requestPasswordReset } from "../services/userApi";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    try {
      const response = await requestPasswordReset(email);
      setSuccess(response.message); // Use response.message instead of the entire response object
    } catch (error) {
      setError(error.message); // Use error.message instead of the entire error object
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Forget Password</div>
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="form-control"
                      id="email"
                      required
                    />
                    {/* Display error message */}
                    {error && <p className="text-danger">{error}</p>}
                    {/* Display success message */}
                    {success && <p className="text-success">{success}</p>}
                  </div>
                  <button
                    type="submit"
                    onClick={handleForgetPassword}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Password Reset Email"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;