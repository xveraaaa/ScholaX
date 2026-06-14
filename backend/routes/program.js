const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all programs (everyone logged in)
router.get('/', authMiddleware, (req, res) => {
  const sql = 'SELECT * FROM programs ORDER BY program_name ASC';
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single program
router.get('/:id', authMiddleware, (req, res) => {
  const sql = 'SELECT * FROM programs WHERE id = ?';
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Program not found' });
    res.json(result[0]);
  });
});

// CREATE program (Admin only)
router.post('/', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const { program_code, program_name, description, duration_years, status } = req.body;

  if (!program_code || !program_name) {
    return res.status(400).json({ message: 'Program code and name are required' });
  }

  // Check if program_code exists
  db.query('SELECT * FROM programs WHERE program_code = ?', [program_code], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) return res.status(400).json({ message: 'Program code already exists' });

    const sql = 'INSERT INTO programs (program_code, program_name, description, duration_years, status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [program_code, program_name, description, duration_years || 4, status || 'active'], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Program created successfully', id: result.insertId });
    });
  });
});

// UPDATE program (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const { program_code, program_name, description, duration_years, status, campus_id } = req.body;

  const sql = 'UPDATE programs SET program_code = ?, program_name = ?, description = ?, duration_years = ?, status = ?, campus_id = ? WHERE id = ?';
  
  db.query(sql, [program_code, program_name, description, duration_years, status, campus_id, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Program not found' });
    res.json({ message: 'Program updated successfully' });
  });
});

// DELETE program (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  // Check if program has students
  db.query('SELECT * FROM students WHERE program_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) {
      return res.status(400).json({ message: 'Cannot delete program with enrolled students' });
    }

    db.query('DELETE FROM programs WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Program not found' });
      res.json({ message: 'Program deleted successfully' });
    });
  });
});

module.exports = router;