const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const totalIncome = await Transaction.aggregate([
      { $match: { user: userId, type: 'Income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalExpenses = await Transaction.aggregate([
      { $match: { user: userId, type: 'Expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const income = totalIncome.length > 0 ? totalIncome[0].total : 0;
    const expenses = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    res.json({ income, expenses, savings: income - expenses });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getSpendingByCategory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const categories = await Transaction.aggregate([
      { $match: { user: userId, type: 'Expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { name: '$_id', value: '$total', _id: 0 } },
    ]);
    res.json(categories);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getSpendingTrends = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const trends = await Transaction.aggregate([
      { $match: { user: userId, type: 'Expense' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', total: 1, _id: 0 } },
    ]);
    res.json(trends);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
