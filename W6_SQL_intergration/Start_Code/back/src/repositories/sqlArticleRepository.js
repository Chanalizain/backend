import { pool } from '../utils/database.js';

// Get all articles
export async function getArticles(filterParams = {}) {
    let connection;
    try {
        connection = await pool.getConnection();

        let sql = `
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist_id,
                a.category_id,
                j.name AS journalistName,
                c.name AS categoryName
            FROM
                articles a
            LEFT JOIN
                journalists j ON a.journalist_id = j.id
            LEFT JOIN
                categories c ON a.category_id = c.id
        `;

        const params = [];
        const whereClauses = [];

        if (filterParams.journalistId) {
            whereClauses.push('a.journalist_id = ?');
            params.push(filterParams.journalistId);
        }

        if (filterParams.categoryId) {
            whereClauses.push('a.category_id = ?');
            params.push(filterParams.categoryId);
        }

        if (whereClauses.length > 0) {
            sql += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        sql += ` ORDER BY a.id ASC`;

        const [rows] = await connection.execute(sql, params);
        return rows;
    } catch (error) {
        console.error("Error in getArticles:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Get one article by ID
export async function getArticleById(id) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist_id,
                a.category_id,
                j.name AS journalistName,
                c.name AS categoryName
            FROM
                articles a
            LEFT JOIN
                journalists j ON a.journalist_id = j.id
            LEFT JOIN
                categories c ON a.category_id = c.id
            WHERE
                a.id = ?
            `,
            [id]
        );
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
export async function createArticle(articleData) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO articles (title, content, journalist_id, category_id) VALUES (?, ?, ?, ?)',
            [articleData.title, articleData.content, articleData.journalistId, articleData.categoryId]
        );
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
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE articles SET title = ?, content = ?, journalist_id = ?, category_id = ? WHERE id = ?',
            [updatedData.title, updatedData.content, updatedData.journalistId, updatedData.categoryId, id]
        );
        if (result.affectedRows === 0) {
            return null;
        }
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
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'DELETE FROM articles WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error in deleteArticle for ID ${id}:`, error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Fetches all articles with their associated journalist's name using a JOIN
export async function getArticlesWithJournalistDetails() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(`
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist_id,
                a.category_id,
                j.name AS journalistName,
                c.name AS categoryName
            FROM
                articles a
            LEFT JOIN
                journalists j ON a.journalist_id = j.id
            LEFT JOIN
                categories c ON a.category_id = c.id
            ORDER BY
                a.id ASC
        `);
        return rows;
    } catch (error) {
        console.error("Error in getArticlesWithJournalistDetails:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Fetches all articles written by a specific journalist name using a JOIN
export async function getArticlesByJournalistName(journalistName) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(`
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist_id,
                a.category_id,
                j.name AS journalistName,
                c.name AS categoryName
            FROM
                articles a
            INNER JOIN
                journalists j ON a.journalist_id = j.id
            LEFT JOIN
                categories c ON a.category_id = c.id
            WHERE
                j.name = ?
            ORDER BY
                a.id ASC
        `, [journalistName]);
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

// Fetches all articles written by a specific journalist ID
export async function getArticlesByJournalistId(journalistId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist_id,
                a.category_id,
                j.name AS journalistName,
                c.name AS categoryName
            FROM
                articles a
            INNER JOIN
                journalists j ON a.journalist_id = j.id
            LEFT JOIN
                categories c ON a.category_id = c.id
            WHERE
                j.id = ?
            `,
            [journalistId]
        );
        return rows;
    } catch (error) {
        console.error(`Error in getArticlesByJournalistId for ID ${journalistId}:`, error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Retrieve all categories
export async function getCategories() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT id, name FROM categories');
        return rows;
    } catch (error) {
        console.error("Error in getCategories:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Retrieve all articles filtered by category, using JOIN
export async function getArticlesByCategoryId(categoryId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `
            SELECT
                a.id,
                a.title,
                a.content,
                a.journalist_id,
                a.category_id,
                j.name AS journalistName,
                c.name AS categoryName
            FROM
                articles a
            LEFT JOIN
                journalists j ON a.journalist_id = j.id
            INNER JOIN
                categories c ON a.category_id = c.id
            WHERE
                c.id = ?
            ORDER BY
                a.id ASC
            `,
            [categoryId]
        );
        return rows;
    } catch (error) {
        console.error(`Error in getArticlesByCategoryId for ID ${categoryId}:`, error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
