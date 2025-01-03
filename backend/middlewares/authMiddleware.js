import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Same secret used for signing JWT tokens

export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
