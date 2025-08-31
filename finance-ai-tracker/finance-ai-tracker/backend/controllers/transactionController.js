const Transaction = require('../models/Transaction');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.parseTransaction = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ msg: 'Text is required' });
  }

  const prompt = `
    Parse the following transaction text into a structured JSON object.
    The object must have "amount" (number), "description" (string), "category" (string), and "type" ("Income" or "Expense").
    Infer the category from the description. Common categories: Food, Transport, Salary, Shopping, Utilities, Entertainment, Health.
    If it sounds like getting paid, the type is "Income". Otherwise, it's "Expense".
    Text: "${text}"
    JSON format: {"amount": <number>, "description": "<string>", "category": "<string>", "type": "<Income|Expense>"}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: "You are an expert financial assistant." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const parsedData = JSON.parse(completion.choices[0].message.content);
    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ msg: 'AI parsing failed. Please try again.' });
  }
};

exports.createTransaction = async (req, res) => {
  const { description, amount, category, type, date } = req.body;
  try {
    const newTransaction = new Transaction({ user: req.user.id, description, amount, category, type, date });
    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateTransaction = async (req, res) => {
  const { description, amount, category, type, date } = req.body;
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    transaction = await Transaction.findByIdAndUpdate(req.params.id, { $set: { description, amount, category, type, date } }, { new: true });
    res.json(transaction);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
