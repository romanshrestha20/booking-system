import pool from "../db.js";
import { hashPassword } from "../utils/helpers.js";

// Create a new user
export const createUser = async (user) => {
  const { name, email, password, role = "customer", confirmationCode } = user;

  const normalizedEmail = email.toLowerCase();

  if (role !== "admin" && role !== "customer") {
    throw new Error('Role must be either "admin" or "customer"');
  }

  const hashedPassword = await hashPassword(password);

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
export const confirmEmail = async (code) => {
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
    throw error;
  }
};

// Update confirmation code for resending email
export const updateConfirmationCode = async (email, newCode) => {
  const normalizedEmail = email.toLowerCase();

  try {
    const result = await pool.query(
      "UPDATE Users SET confirmation_code = $1 WHERE email = $2 RETURNING *",
      [newCode, normalizedEmail]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};


/**
 * Request password reset.
 * @param {string} email - The user's email.
 * @param {string} resetToken - The reset token.
 * @param {Date} resetTokenExpires - The reset token expiration date.
 * @returns {object} - The updated user.
 */
export const requestPasswordReset = async (email, resetToken, resetTokenExpires) => {
  const normalizedEmail = email.toLowerCase();

  try {
    const result = await pool.query(
      "UPDATE Users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3 RETURNING *",
      [resetToken, resetTokenExpires, normalizedEmail]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password.
 * @param {string} token - The reset token.
 * @param {string} hashedPassword - The hashed new password.
 * @returns {object} - The updated user.
 */
export const resetPassword = async (token, hashedPassword) => {
  try {
    const result = await pool.query(
      "UPDATE Users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE reset_password_token = $2 AND reset_password_expires > NOW() RETURNING *",
      [hashedPassword, token]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM Users");
    return result.rows;
  } catch (error) {
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
    throw error;
  }
};