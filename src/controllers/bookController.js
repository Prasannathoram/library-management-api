const bookService = require("../services/bookService");

exports.getBooks = async (req, res) => {
    const books = await bookService.getAllBooks();
    res.json(books);
};

exports.addBook = async (req, res) => {
    const id = await bookService.createBook(req.body);
    res.json({ message: "Book added", id });
};