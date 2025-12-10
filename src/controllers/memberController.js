
const memberService = require("../services/memberService");

exports.getAllMembers = async (req, res) => {
  try {
    const members = await memberService.getAllMembers();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await memberService.getMemberById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const id = await memberService.createMember(req.body);
    res.status(201).json({ message: "Member created", id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    await memberService.updateMember(req.params.id, req.body);
    res.json({ message: "Member updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    await memberService.deleteMember(req.params.id);
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBorrowedByMember = async (req, res) => {
  try {
    const rows = await memberService.getBorrowedByMember(req.params.id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};