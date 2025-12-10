const express = require("express");
const router = express.Router();
const fineController = require("../controllers/fineController");

router.post("/", fineController.createFine);

module.exports = router;