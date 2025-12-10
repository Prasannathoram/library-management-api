
const pool = require("../config/db");

async function getAllBooks() {
  const [rows] = await pool.query("SELECT * FROM books");
  return rows;
}

async function getAvailableBooks() {
  const [rows] = await pool.query(
    "SELECT * FROM books WHERE available_copies > 0 AND status = 'available'"
  );
  return rows;
}

async function getBookById(id) {
  const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createBook(data) {
  const {
    isbn,
    title,
    author,
    category,
    total_copies,
    available_copies = total_copies,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO books (isbn, title, author, category, status, total_copies, available_copies)
     VALUES (?, ?, ?, ?, 'available', ?, ?)`,
    [isbn, title, author, category, total_copies, available_copies]
  );

  return result.insertId;
}

async function updateBook(id, data) {
  const {
    isbn,
    title,
    author,
    category,
    status,
    total_copies,
    available_copies,
  } = data;

  await pool.query(
    `UPDATE books
     SET isbn = ?, title = ?, author = ?, category = ?, status = ?,
         total_copies = ?, available_copies = ?
     WHERE id = ?`,
    [isbn, title, author, category, status, total_copies, available_copies, id]
  );
}

async function deleteBook(id) {
  await pool.query("DELETE FROM books WHERE id = ?", [id]);
}

module.exports = {
  getAllBooks,
  getAvailableBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};