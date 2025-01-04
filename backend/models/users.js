import pool from "../db.js";
import bcrypt from "bcrypt";

// Hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Generate a 6-digit confirmation code
const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
};

// Create a new user
export const createUser = async (user) => {
  const { name, email, password, role = "customer" } = user;

  const normalizedEmail = email.toLowerCase();

  if (role !== "admin" && role !== "customer") {
    throw new Error('Role must be either "admin" or "customer"');
  }

  const hashedPassword = await hashPassword(password);
  const confirmationCode = generateSixDigitCode(); // Generate a 6-digit code

  try {
    const result = await pool.query(
      "INSERT INTO Users (name, email, password, role, confirmation_code, is_confirmed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, normalizedEmail, hashedPassword, role, confirmationCode, false]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }
    throw error;
  }
};

// Confirm email with 6-digit code
export const emailConfirmation = async (code) => {
  try {
    const user = await pool.query(
      "SELECT * FROM Users WHERE confirmation_code = $1",
      [code]
    );

    if (user.rows.length === 0) {
      throw new Error("Invalid code");
    }

    const result = await pool.query(
      "UPDATE Users SET is_confirmed = true, confirmation_code = NULL WHERE user_id = $1 RETURNING *",
      [user.rows[0].user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Resend confirmation email with a new 6-digit code
export const resendConfirmationEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await pool.query(
      "SELECT * FROM Users WHERE email = $1",
      [normalizedEmail]
    );

    if (user.rows.length === 0) {
      throw new Error("User not found");
    }

    const foundUser = user.rows[0];

    if (foundUser.is_confirmed) {
      throw new Error("Email is already confirmed");
    }

    const newCode = generateSixDigitCode(); // Generate a new 6-digit code

    await pool.query(
      "UPDATE Users SET confirmation_code = $1 WHERE user_id = $2",
      [newCode, foundUser.user_id]
    );

    return { email: foundUser.email, code: newCode };
  } catch (error) {
    console.error(error.message);
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
    const result = await pool.query(
      "SELECT * FROM Users WHERE user_id = $1",
      [user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Get a user by email
export const getUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();
  try {
    const result = await pool.query(
      "SELECT * FROM Users WHERE email = $1",
      [normalizedEmail]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Update a user by ID
export const updateUser = async (user_id, user) => {
  const { name, email, password, role } = user;

  if (role && role !== "admin" && role !== "customer") {
    throw new Error('Role must be either "admin" or "customer"');
  }

  const normalizedEmail = email.toLowerCase();
  const hashedPassword = password ? await hashPassword(password) : undefined;

  try {
    const result = await pool.query(
      "UPDATE Users SET name = $1, email = $2, password = $3, role = $4 WHERE user_id = $5 RETURNING *",
      [name, normalizedEmail, hashedPassword || password, role, user_id]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }
    throw error;
  }
};

// Delete a user by ID
export const deleteUser = async (user_id) => {
  try {
    await pool.query("DELETE FROM Users WHERE user_id = $1", [user_id]);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};