import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Use path module for more robust path resolution
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv with an absolute path to ensure it finds the .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection to provide clear feedback
pool.getConnection()
    .then(connection => {
        console.log('Database connection pool created and connected successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database pool:', err.message);
        console.error('Please check your .env file for correct DB_USER and DB_PASSWORD.');
        console.error('The current values being used are:');
        console.error(`DB_USER: "${process.env.DB_USER}"`);
        console.error(`DB_PASSWORD: "${process.env.DB_PASSWORD}"`);
        process.exit(1);
    });

export { pool };
