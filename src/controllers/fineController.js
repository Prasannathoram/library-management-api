
const fineService = require("../services/fineService");

exports.getAllFines = async (req, res) => {
  try {
    const fines = await fineService.getAllFines();
    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.payFine = async (req, res) => {
  try {
    const fineId = req.params.id;
    await fineService.payFine(fineId);
    res.json({ message: "Fine marked as paid" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};