//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
import { pool } from '../utils/database.js';

// Get all articles
export async function getArticles() {
    // TODO
    let connection; // Declare connection variable to ensure it's accessible in finally block
    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Execute the SQL query to select all articles
        // [rows] destructures the first element of the result array, which contains the rows
        const [rows] = await connection.execute('SELECT id, title, content, journalist, category FROM articles');
        return rows;
    } catch (error) {
        console.error("Error in getArticles:", error);
        // Re-throw the error so the calling controller can handle it appropriately
        throw error;
    } finally {
        // Ensure the connection is released back to the pool, even if an error occurs
        if (connection) {
            connection.release();
        }
    }
}

// Get one article by ID
export async function getArticleById(id) {
    // TODO
    let connection;
    try {
        connection = await pool.getConnection();

        // Execute the SQL query to select an article by ID using a prepared statement
        const [rows] = await connection.execute(
            `
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist,      -- Old journalist string
                a.category,
                a.journalist_id,
                j.name AS journalistName,    -- Journalist's name from journalists table
                j.email AS journalistEmail,  -- Journalist's email from journalists table
                j.bio AS journalistBio       -- Journalist's bio from journalists table
            FROM
                articles a
            LEFT JOIN
                journalists j ON a.journalist_id = j.id
            WHERE
                a.id = ?
            `,
            [id] // Pass the ID as a parameter to prevent SQL injection
        );

        // If a row is found, return the first (and only) row; otherwise, return null
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error(`Error in getArticleById for ID ${id}:`, error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Create a new article
export async function createArticle(article) {
    // TODO
    let connection;
    try {
        connection = await pool.getConnection();

        // Execute the SQL INSERT query using a prepared statement
        const [result] = await connection.execute(
            'INSERT INTO articles (title, content, journalist, category) VALUES (?, ?, ?, ?)',
            [articleData.title, articleData.content, articleData.journalist, articleData.category]
        );

        // The result object for INSERT queries contains insertId for auto-incremented primary keys
        const newArticle = { id: result.insertId, ...articleData };
        return newArticle;
    } catch (error) {
        console.error("Error in createArticle:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    // TODO
    let connection;
    try {
        connection = await pool.getConnection();

        // Execute the SQL UPDATE query using a prepared statement
        const [result] = await connection.execute(
            'UPDATE articles SET title = ?, content = ?, journalist = ?, category = ? WHERE id = ?',
            [updatedData.title, updatedData.content, updatedData.journalist, updatedData.category, id]
        );

        // If affectedRows is 0, no article with the given ID was found to update
        if (result.affectedRows === 0) {
            return null; // Indicate that the article was not found
        }

        // Return the updated article data, assuming the update was successful
        return { id: id, ...updatedData };
    } catch (error) {
        console.error(`Error in updateArticle for ID ${id}:`, error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Delete an article by ID
export async function deleteArticle(id) {
    // TODO
    let connection;
    try {
        connection = await pool.getConnection();

        // Execute the SQL DELETE query using a prepared statement
        const [result] = await connection.execute(
            'DELETE FROM articles WHERE id = ?',
            [id]
        );

        // If affectedRows is 0, no article with the given ID was found to delete
        return result.affectedRows > 0; // Returns true if 1 or more rows were deleted, false otherwise
    } catch (error) {
        console.error(`Error in deleteArticle for ID ${id}:`, error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

//Fetches all articles with their associated journalist's name using a JOIN
export async function getArticlesWithJournalistName() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(`
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist,      -- This is the old journalist string, keep for backward compatibility if needed
                a.category,
                a.journalist_id,
                j.name AS journalistName, -- The journalist's name from the journalists table
                j.email AS journalistEmail,
                j.bio AS journalistBio
            FROM
                articles a
            LEFT JOIN
                journalists j ON a.journalist_id = j.id
            ORDER BY
                a.id ASC
        `);
        return rows;
    } catch (error) {
        console.error("Error in getArticlesWithJournalistName:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

//Fetches all articles written by a specific journalist name using a JOIN
export async function getArticlesByJournalistName(journalistName) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(`
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist,      -- Old journalist string
                a.category,
                a.journalist_id,
                j.name AS journalistName,
                j.email AS journalistEmail,
                j.bio AS journalistBio
            FROM
                articles a
            INNER JOIN    -- Use INNER JOIN here as we specifically need articles with a matched journalist
                journalists j ON a.journalist_id = j.id
            WHERE
                j.name = ?
            ORDER BY
                a.id ASC
        `, [journalistName]); // Pass journalistName as a parameter for the WHERE clause
        return rows;
    } catch (error) {
        console.error(`Error in getArticlesByJournalistName for '${journalistName}':`, error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
