const memberService = require("../services/memberService");

exports.getMembers = async (req, res) => {
    const members = await memberService.getAllMembers();
    res.json(members);
};

exports.addMember = async (req, res) => {
    const id = await memberService.createMember(req.body);
    res.json({ message: "Member added", id });
};