const pool = require("../config/db");

exports.getAllMembers = async () => {
    const [rows] = await pool.query("SELECT * FROM members");
    return rows;
};

exports.createMember = async (data) => {
    const { name, email } = data;

    const sql = `
        INSERT INTO members (name, email)
        VALUES (?, ?)
    `;

    const [result] = await pool.query(sql, [name, email]);
    return result.insertId;
};