
const bookService = require("../services/bookService");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableBooks = async (req, res) => {
  try {
    const books = await bookService.getAvailableBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const id = await bookService.createBook(req.body);
    res.status(201).json({ message: "Book created", id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    await bookService.updateBook(req.params.id, req.body);
    res.json({ message: "Book updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};