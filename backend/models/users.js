import pool from "../db.js";
import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
export const createUser = async (user) => {
  const { name, email, password, role = "customer" } = user;

  // Normalize email to lowercase
  const normalizedEmail = email.toLowerCase();

  // Validate role
  if (role !== "admin" && role !== "customer") {
    throw new Error('Role must be either "admin" or "customer"');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);


  try {
    const result = await pool.query(
      "INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, normalizedEmail, hashedPassword, role]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL error code for unique violation
      throw new Error("Email already exists");
    }
    throw error;
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM Users");
    return result.rows;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Get a user by ID
export const getUserById = async (user_id) => {
  try {
    const result = await pool.query("SELECT * FROM Users WHERE user_id = $1", [
      user_id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Get a user by email
export const getUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Update a user by ID
export const updateUser = async (user_id, user) => {
  const { name, email, password, role } = user;

  // Validate role
  if (role && role !== "admin" && role !== "customer") {
    throw new Error('Role must be either "admin" or "customer"');
  }
  const normalizedEmail = email.toLowerCase();


  // If password is provided, hash it
  const updatedPassword = password ? await hashPassword(password) : undefined;

  try {
    const result = await pool.query(
      "UPDATE Users SET name = $1, email = $2, password = $3, role = $4 WHERE user_id = $5 RETURNING *",
      [name, normalizedEmail, updatedPassword || password, role, user_id]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL error code for unique violation
      throw new Error("Email already exists");
    }
    throw error;
  }
};

// Delete a user by ID
export const deleteUser = async (user_id) => {
    try {
      await pool.query('DELETE FROM Users WHERE user_id = $1', [user_id]);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
