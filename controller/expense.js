const express = require('express');
const router = express.Router();
const db = require('./db');

// GET all expenses
router.get('/', (req, res) => {
  const sql = `
    SELECT e.*, c.name AS category_name, c.icon, c.color
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.category_id
    ORDER BY e.date DESC, e.time DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Search  expenses
router.get('/search', (req, res) => {
  const { from, to } = req.query;
  const sql = `
    SELECT e.*, c.name AS category_name, c.icon, c.color
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.category_id
    WHERE date BETWEEN ? AND ?
    ORDER BY e.date DESC, e.time DESC
  `;

  db.query(sql, [from, to], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET by ID expenses
router.get('/:id', (req, res) => {
  const sql = `
    SELECT e.*, c.name AS category_name, c.icon, c.color
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.category_id
    WHERE expense_id = ?
    ORDER BY e.date DESC, e.time DESC
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST new expense
router.post('/', (req, res) => {
  const {
    amount, category_id, subcategory, date, time,
    note, payment_mode, location
  } = req.body;

  const sql = `
    INSERT INTO expenses 
    (amount, category_id, subcategory, date, time, note, payment_mode, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [amount, category_id, subcategory, date, time, note, payment_mode, location], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Expense added', expense_id: result.insertId });
  });
});

// PUT update expense
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const {
    amount, category_id, subcategory, date, time,
    note, payment_mode, location
  } = req.body;

  const sql = `
    UPDATE expenses SET 
    amount=?, category_id=?, subcategory=?, date=?, time=?, 
    note=?, payment_mode=?, location=? 
    WHERE expense_id=?
  `;

  db.query(sql, [amount, category_id, subcategory, date, time, note, payment_mode, location, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Expense updated' });
  });
});

// DELETE expense
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM expenses WHERE expense_id = ?`;
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Expense deleted' });
  });
});

module.exports = router;


