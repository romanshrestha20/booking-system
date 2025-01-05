// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.message === "Email already exists") {
    return res.status(409).json({ error: err.message });
  }
  if (err.message === "Invalid credentials") {
    return res.status(401).json({ error: err.message });
  }
  if (err.message === "User not found") {
    return res.status(404).json({ error: err.message });
  }

  res.status(500).json({ error: "Server error" });
};
