
const pool = require("../config/db");

async function getAllFines() {
  const [rows] = await pool.query(
    `SELECT f.*, m.name AS member_name, b.title AS book_title
     FROM fines f
     JOIN transactions t ON f.transaction_id = t.id
     JOIN members m ON t.member_id = m.id
     JOIN books b ON t.book_id = b.id`
  );
  return rows;
}

async function payFine(fineId) {
  await pool.query(
    "UPDATE fines SET paid_at = NOW() WHERE id = ? AND paid_at IS NULL",
    [fineId]
  );
}

module.exports = {
  getAllFines,
  payFine,
};