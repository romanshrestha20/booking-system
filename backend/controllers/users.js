import {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "../models/users.js";

// Create a new user
export const createUserController = async (req, res) => {
  const { name, email, password, role = "customer" } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }
  // Normalize email to lowercase
  const normalizedEmail = email.toLowerCase();

  // Validate role
  if (role !== "admin" && role !== "customer") {
    return res
      .status(400)
      .json({ error: 'Role must be either "admin" or "customer"' });
  }

  try {
    const newUser = await createUser({
      name,
      email: normalizedEmail,
      password,
      role,
    });
    res.status(201).json({
      message: "User created",
      user: newUser,
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      res.status(409).json({ error: error.message });
    } else {
      console.error("Error creating user:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
};

// Get all users
export const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();
    res.json({
      message: "Users fetched",
      users,
    }); // Send the users data as a JSON response
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Server error" }); // Send a 500 Server Error response
  }
};

// Get a user by ID
export const getUserByIdController = async (req, res) => {
  const user_id = parseInt(req.params.user_id); // Convert user_id to an integer

  // Validate user_id is a positive integer
  if (isNaN(user_id) || user_id <= 0) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await getUserById(user_id);
    if (user) {
      res.json({
        message: "User fetched",
        user,
      }); // Send the user data as a JSON response
    } else {
      res.status(404).json({ error: "User not found" }); // Send a 404 Not Found response
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Server error" }); // Send a 500 Server Error response
  }
};

// Get a user by email
export const getUserByEmailController = async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  // Validate email is provided
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await getUserByEmail(email);
    if (user) {
      res.json(user); // Send the user data as a JSON response
    } else {
      res.status(404).json({ error: "User not found" }); // Send a 404 Not Found response
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Server error" }); // Send a 500 Server Error response
  }
};

// Update a user by ID
export const updateUserController = async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  // Validate user_id is a positive integer
  if (isNaN(user_id) || user_id <= 0) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }
  // Normalize email to lowercase
  const normalizedEmail = email.toLowerCase();

  // Validate role
  if (role && role !== "admin" && role !== "customer") {
    return res
      .status(400)
      .json({ error: 'Role must be either "admin" or "customer"' });
  }

  try {
    const updatedUser = await updateUser(user_id, {
      name,
      email: normalizedEmail,
      password,
      role,
    });
    if (updatedUser) {
      res.json({
        message: "User updated",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    if (error.message === "Email already exists") {
      res.status(409).json({ error: error.message });
    } else {
      console.error("Error updating user:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
};
// Delete a user by ID
export const deleteUserController = async (req, res) => {
  const user_id = parseInt(req.params.user_id); // Convert user_id to an integer

  // Validate user_id is a positive integer
  if (isNaN(user_id) || user_id <= 0) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // Check if the user exists
    const user = await getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Send a 404 Not Found response
    }

    // Delete the user
    await deleteUser(user_id);
    res.status(204).send(); // Send a 204 No Content response for successful deletion
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Server error" }); // Send a 500 Server Error response
  }
};