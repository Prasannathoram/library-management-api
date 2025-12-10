const transactionService = require("../services/transactionService");

exports.borrowBook = async (req, res) => {
    const { member_id, book_id } = req.body;

    const id = await transactionService.borrowBook(member_id, book_id);

    res.json({ message: "Book borrowed", id });
};