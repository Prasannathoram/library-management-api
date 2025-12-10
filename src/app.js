
const express = require("express");
const app = express();

const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const fineRoutes = require("./routes/fineRoutes");

app.use(express.json());

app.use("/books", bookRoutes);
app.use("/members", memberRoutes);
app.use("/transactions", transactionRoutes);
app.use("/fines", fineRoutes);

module.exports = app;