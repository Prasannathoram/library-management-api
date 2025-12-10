
const express = require("express");
const router = express.Router();
const fineController = require("../controllers/fineController");

router.get("/", fineController.getAllFines);
router.post("/:id/pay", fineController.payFine);

module.exports = router;