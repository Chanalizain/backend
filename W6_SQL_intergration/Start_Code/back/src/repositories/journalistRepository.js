import { pool } from '../utils/database.js';

export async function getAllJournalists() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT id, name FROM journalists');
        return rows;
    } catch (error) {
        console.error("Error in getAllJournalists:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
