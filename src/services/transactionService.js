// src/services/transactionService.js
const pool = require("../config/db");

const MAX_BORROW_LIMIT = 3;
const LOAN_DAYS = 14;
const FINE_PER_DAY = 10;

// Helper: count overdue transactions for member
async function countOverdueForMember(memberId) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM transactions WHERE member_id = ? AND status = 'overdue'",
    [memberId]
  );
  return rows[0].count;
}

// Helper: check unpaid fines
async function hasUnpaidFines(memberId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM fines f
     JOIN transactions t ON f.transaction_id = t.id
     WHERE t.member_id = ? AND f.paid_at IS NULL`,
    [memberId]
  );
  return rows[0].count > 0;
}

// Borrow a book
async function borrowBook(memberId, bookId) {
  // 1. Member check
  const [memberRows] = await pool.query(
    "SELECT status FROM members WHERE id = ?",
    [memberId]
  );
  if (memberRows.length === 0) throw new Error("Member not found");
  if (memberRows[0].status === "suspended")
    throw new Error("Member is suspended");

  // Block borrowing if unpaid fines
  if (await hasUnpaidFines(memberId)) {
    throw new Error("Member has unpaid fines");
  }

  // 2. Borrowed count
  const [activeRows] = await pool.query(
    "SELECT COUNT(*) AS count FROM transactions WHERE member_id = ? AND status IN ('active', 'overdue')",
    [memberId]
  );
  if (activeRows[0].count >= MAX_BORROW_LIMIT) {
    throw new Error("Member has reached maximum borrow limit");
  }

  // 3. Book check
  const [bookRows] = await pool.query(
    "SELECT available_copies FROM books WHERE id = ?",
    [bookId]
  );
  if (bookRows.length === 0) throw new Error("Book not found");
  if (bookRows[0].available_copies < 1)
    throw new Error("No available copies for this book");

  // 4. Create transaction
  const [result] = await pool.query(
    `INSERT INTO transactions (member_id, book_id, status, borrowed_at, due_date)
     VALUES (?, ?, 'active', NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))`,
    [memberId, bookId, LOAN_DAYS]
  );

  // 5. Update book availability
  await pool.query(
    `UPDATE books
     SET available_copies = available_copies - 1,
         status = CASE WHEN available_copies - 1 = 0 THEN 'borrowed' ELSE status END
     WHERE id = ?`,
    [bookId]
  );

  return result.insertId;
}

// Return a book
async function returnBook(transactionId) {
  // Find transaction
  const [rows] = await pool.query(
    "SELECT * FROM transactions WHERE id = ?",
    [transactionId]
  );
  if (rows.length === 0) throw new Error("Transaction not found");

  const tx = rows[0];
  if (tx.status === "returned")
    throw new Error("Book already returned for this transaction");

  const now = new Date();
  const due = new Date(tx.due_date);

  let status = "returned";
  let fineAmount = 0;

  if (now > due) {
    const daysLate = Math.ceil(
      (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );
    fineAmount = daysLate * FINE_PER_DAY;
    status = "overdue";
  }

  // Update transaction
  await pool.query(
    `UPDATE transactions
     SET status = ?, returned_at = NOW()
     WHERE id = ?`,
    [status, transactionId]
  );

  // Update book copy
  await pool.query(
    `UPDATE books
     SET available_copies = available_copies + 1,
         status = 'available'
     WHERE id = ?`,
    [tx.book_id]
  );

  // Create fine if needed
  if (fineAmount > 0) {
    await pool.query(
      `INSERT INTO fines (transaction_id, amount)
       VALUES (?, ?)`,
      [transactionId, fineAmount]
    );

    // Check suspension rule: 3 or more overdue transactions
    const overdueCount = await countOverdueForMember(tx.member_id);
    if (overdueCount >= 3) {
      await pool.query(
        "UPDATE members SET status = 'suspended' WHERE id = ?",
        [tx.member_id]
      );
    }
  }

  return { status, fineAmount };
}

// Get overdue transactions
async function getOverdueTransactions() {
  const [rows] = await pool.query(
    `SELECT t.*, b.title AS book_title, m.name AS member_name
     FROM transactions t
     JOIN books b ON t.book_id = b.id
     JOIN members m ON t.member_id = m.id
     WHERE t.status = 'overdue'`
  );
  return rows;
}

module.exports = {
  borrowBook,
  returnBook,
  getOverdueTransactions,
};