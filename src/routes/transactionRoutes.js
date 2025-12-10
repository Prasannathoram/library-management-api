
const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionController");

router.post("/borrow", controller.borrowBook);
router.post("/:id/return", controller.returnBook);
router.get("/overdue", controller.getOverdue);

module.exports = router;