const express = require('express');
const router = express.Router();
const db = require('./db');

// GET all categories
router.get('/', (req, res) => {
  db.query(`SELECT 
    c.category_id,
    c.name,
    c.icon,
    c.color,
    COUNT(e.expense_id) AS expense_count
FROM 
    categories c
LEFT JOIN 
    expenses e ON c.category_id = e.category_id
GROUP BY 
    c.category_id, c.name, c.icon, c.color
ORDER BY 
    expense_count DESC, c.name;`, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET by ID expenses
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM categories WHERE category_id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// POST new category
router.post('/', (req, res) => {
  const { name, icon, color } = req.body;
  db.query('INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)', [name, icon, color], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Category added', category_id: result.insertId });
  });
});

// PUT update category
router.put('/:id', (req, res) => {
  const { name, icon, color } = req.body;
  db.query('UPDATE categories SET name=?, icon=?, color=? WHERE category_id=?', [name, icon, color, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Category updated' });
  });
});

// DELETE category
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM categories WHERE category_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Category deleted' });
  });
});

module.exports = router;
