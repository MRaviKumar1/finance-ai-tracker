const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, default: 'General' },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
