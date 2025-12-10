const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/borrow", transactionController.borrowBook);

module.exports = router;