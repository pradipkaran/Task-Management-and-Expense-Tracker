const Expense = require('../models/expense');

exports.createExpense = async (req, res) => {
    const { title, amount, category } = req.body;

    try {
        const expense = await Expense.create({
            title,
            amount,
            category,
            user: req.user._id,
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'amount', 'category'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates!' });
    }

    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        updates.forEach((update) => (expense[update] = req.body[update]));
        await expense.save();

        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
