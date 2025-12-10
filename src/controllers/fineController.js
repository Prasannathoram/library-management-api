const fineService = require("../services/fineService");

exports.createFine = async (req, res) => {
    const { transaction_id, amount } = req.body;

    const id = await fineService.createFine(transaction_id, amount);

    res.json({ message: "Fine created", id });
};