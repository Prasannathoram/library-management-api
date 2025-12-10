
const transactionService = require("../services/transactionService");

exports.borrowBook = async (req, res) => {
  try {
    const { member_id, book_id } = req.body;
    const id = await transactionService.borrowBook(member_id, book_id);
    res.status(201).json({ message: "Book borrowed", transaction_id: id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const result = await transactionService.returnBook(transactionId);
    res.json({
      message: "Book returned",
      status: result.status,
      fine: result.fineAmount,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOverdue = async (req, res) => {
  try {
    const rows = await transactionService.getOverdueTransactions();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};