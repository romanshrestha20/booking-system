import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Validate required environment variables
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

// PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10), // Ensure port is a number
});

// Log connection events
pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err);
    process.exit(-1); // Exit the process on critical database errors
});

// Test the database connection on startup
const testConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('Database connection test successful');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error; // Re-throw the error to handle it in the calling function
    } finally {
        if (client) {
            client.release(); // Ensure the client is always released
        }
    }
};

// Execute the connection test
testConnection()
    .then(() => {
        console.log('Database connection test completed successfully');
    })
    .catch((error) => {
        console.error('Error during the connection test:', error);
        process.exit(-1); // Exit the process if the connection test fails
    });

// Export the pool for use in other modules
export default pool;