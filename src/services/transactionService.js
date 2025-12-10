const pool = require("../config/db");

exports.borrowBook = async (member_id, book_id) => {
    const [book] = await pool.query(
        "SELECT available_copies FROM books WHERE id = ?",
        [book_id]
    );

    if (book.length === 0) throw new Error("Book not found");
    if (book[0].available_copies < 1) throw new Error("Book not available");

    // decrease available copies
    await pool.query(
        "UPDATE books SET available_copies = available_copies - 1 WHERE id = ?",
        [book_id]
    );

    // create transaction
    const [result] = await pool.query(
        `INSERT INTO transactions (member_id, book_id, status, due_date)
         VALUES (?, ?, 'borrowed', DATE_ADD(NOW(), INTERVAL 7 DAY))`,
        [member_id, book_id]
    );

    return result.insertId;
};