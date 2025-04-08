const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }, // Will store encrypted text
  date: { type: Date, default: Date.now },
  isSuspicious: { type: Boolean, default: false }
});

module.exports = mongoose.model("Expense", expenseSchema);
