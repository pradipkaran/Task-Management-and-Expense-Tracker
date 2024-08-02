const express = require('express');
const {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
} = require('../controllers/expenseController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createExpense);
router.get('/', auth, getExpenses);
router.patch('/:id', auth, updateExpense);
router.delete('/:id', auth, deleteExpense);

module.exports = router;
