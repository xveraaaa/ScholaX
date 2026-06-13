const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all campuses
router.get('/', authMiddleware, (req, res) => {
  const sql = 'SELECT * FROM campuses ORDER BY campus_name ASC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single campus
router.get('/:id', authMiddleware, (req, res) => {
  const sql = 'SELECT * FROM campuses WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Campus not found' });
    res.json(result[0]);
  });
});

// CREATE campus (Admin only)
router.post('/', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const { campus_code, campus_name, address, contact, email, status } = req.body;
  
  if (!campus_code || !campus_name) {
    return res.status(400).json({ message: 'Campus code and name are required' });
  }
  
  db.query('SELECT * FROM campuses WHERE campus_code = ?', [campus_code], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) return res.status(400).json({ message: 'Campus code already exists' });
    
    const sql = 'INSERT INTO campuses (campus_code, campus_name, address, contact, email, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [campus_code, campus_name, address, contact, email, status || 'active'], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Campus created successfully', id: result.insertId });
    });
  });
});

// UPDATE campus (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const { campus_code, campus_name, address, contact, email, status } = req.body;
  
  const sql = 'UPDATE campuses SET campus_code = ?, campus_name = ?, address = ?, contact = ?, email = ?, status = ? WHERE id = ?';
  db.query(sql, [campus_code, campus_name, address, contact, email, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Campus not found' });
    res.json({ message: 'Campus updated successfully' });
  });
});

// DELETE campus (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  db.query('DELETE FROM campuses WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Campus not found' });
    res.json({ message: 'Campus deleted successfully' });
  });
});

module.exports = router;