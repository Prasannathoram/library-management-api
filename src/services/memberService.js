
const pool = require("../config/db");

async function getAllMembers() {
  const [rows] = await pool.query("SELECT * FROM members");
  return rows;
}

async function getMemberById(id) {
  const [rows] = await pool.query("SELECT * FROM members WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createMember(data) {
  const { name, email } = data;

  const [result] = await pool.query(
    `INSERT INTO members (name, email, status)
     VALUES (?, ?, 'active')`,
    [name, email]
  );

  return result.insertId;
}

async function updateMember(id, data) {
  const { name, email, status } = data;

  await pool.query(
    `UPDATE members
     SET name = ?, email = ?, status = ?
     WHERE id = ?`,
    [name, email, status, id]
  );
}

async function deleteMember(id) {
  await pool.query("DELETE FROM members WHERE id = ?", [id]);
}

async function getBorrowedByMember(memberId) {
  const [rows] = await pool.query(
    `SELECT t.id AS transaction_id,
            b.id AS book_id,
            b.title,
            t.borrowed_at,
            t.due_date,
            t.status
     FROM transactions t
     JOIN books b ON t.book_id = b.id
     WHERE t.member_id = ? AND t.status IN ('active', 'overdue')`,
    [memberId]
  );
  return rows;
}

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getBorrowedByMember,
};