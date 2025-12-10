const pool = require("../config/db");

exports.createFine = async (transaction_id, amount) => {
    const [result] = await pool.query(
        "INSERT INTO fines (transaction_id, amount) VALUES (?, ?)",
        [transaction_id, amount]
    );

    return result.insertId;
};
