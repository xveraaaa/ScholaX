const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all programs with campus info (everyone logged in)
router.get('/', authMiddleware, (req, res) => {
  const sql = `
    SELECT p.*, c.campus_name, c.campus_code 
    FROM programs p
    LEFT JOIN campuses c ON p.campus_id = c.id
    ORDER BY p.program_name ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single program with campus info
router.get('/:id', authMiddleware, (req, res) => {
  const sql = `
    SELECT p.*, c.campus_name, c.campus_code 
    FROM programs p
    LEFT JOIN campuses c ON p.campus_id = c.id
    WHERE p.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Program not found' });
    res.json(result[0]);
  });
});

// CREATE program (Admin only)
router.post('/', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const { program_code, program_name, description, duration_years, status, campus_id } = req.body;

  if (!program_code || !program_name) {
    return res.status(400).json({ message: 'Program code and name are required' });
  }

  // Check if program_code exists
  db.query('SELECT * FROM programs WHERE program_code = ?', [program_code], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) return res.status(400).json({ message: 'Program code already exists' });

    const sql = `INSERT INTO programs (program_code, program_name, description, duration_years, status, campus_id) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [program_code, program_name, description, duration_years || 4, status || 'active', campus_id || null], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Program created successfully', id: result.insertId });
    });
  });
});

// UPDATE program (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const { program_code, program_name, description, duration_years, status, campus_id } = req.body;

  const sql = `UPDATE programs 
               SET program_code = ?, program_name = ?, description = ?, 
                   duration_years = ?, status = ?, campus_id = ? 
               WHERE id = ?`;
  
  db.query(sql, [program_code, program_name, description, duration_years, status, campus_id || null, req.params.id], (err, result) => {
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

// GET programs by campus
router.get('/campus/:campus_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT p.*, c.campus_name 
    FROM programs p
    LEFT JOIN campuses c ON p.campus_id = c.id
    WHERE p.campus_id = ?
    ORDER BY p.program_name ASC
  `;
  
  db.query(sql, [req.params.campus_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;