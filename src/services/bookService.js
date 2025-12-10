const pool = require("../config/db");

exports.getAllBooks = async () => {
    const [rows] = await pool.query("SELECT * FROM books");
    return rows;
};

exports.createBook = async (data) => {
    const { title, author, category, total_copies } = data;

    const sql = `
        INSERT INTO books (title, author, category, total_copies, available_copies)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        title, author, category, total_copies, total_copies
    ]);

    return result.insertId;
};
