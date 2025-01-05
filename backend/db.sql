-- Drop existing tables if they exist (to avoid conflicts)
DROP TABLE IF EXISTS Bookings;
DROP TABLE IF EXISTS Rooms;
DROP TABLE IF EXISTS Users;

-- Create Users Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')), -- Enforces valid roles
    confirmation_code VARCHAR(6), -- 6-digit code for email confirmation
    is_confirmed BOOLEAN DEFAULT false, -- Tracks whether the email is confirmed
    reset_password_token VARCHAR(255), -- Token for password reset
    reset_password_expires TIMESTAMP -- Expiration time for the password reset token
);

-- Create Rooms Table
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) UNIQUE NOT NULL, -- Ensures room_number is unique
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    description TEXT
);

-- Create Bookings Table
CREATE TABLE Bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id), -- Foreign key to Users table
    room_id INT REFERENCES Rooms(room_id), -- Foreign key to Rooms table
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed'
);

-- Insert Sample Data into Users Table
INSERT INTO Users (name, email, password, role, confirmation_code, is_confirmed) VALUES
('John Doe', 'john.doe@example.com', 'password123', 'customer', '123456', true),
('Jane Smith', 'jane.smith@example.com', 'password456', 'customer', '654321', false),
('Admin User', 'admin@example.com', 'admin123', 'admin', '987654', true);

-- Insert Sample Data into Rooms Table
INSERT INTO Rooms (room_number, type, price, is_available, description) VALUES
('101', 'Single', 100.00, true, 'A cozy single room with a view of the garden.'),
('102', 'Double', 150.00, true, 'A spacious double room with a king-sized bed and a balcony.'),
('103', 'Suite', 250.00, false, 'A luxurious suite with a living area, jacuzzi, and panoramic city view.');

-- Insert Sample Data into Bookings Table
INSERT INTO Bookings (user_id, room_id, check_in_date, check_out_date, total_price, status) VALUES
(1, 1, '2023-10-15', '2023-10-17', 200.00, 'confirmed'),
(2, 2, '2023-10-20', '2023-10-22', 300.00, 'confirmed');

-- Display Data from Users Table
SELECT * FROM Users;

-- Display Data from Rooms Table
SELECT * FROM Rooms;

-- Display Data from Bookings Table
SELECT * FROM Bookings;