const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.get("/", memberController.getMembers);
router.post("/", memberController.addMember);

module.exports = router;