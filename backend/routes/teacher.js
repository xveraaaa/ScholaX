const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all teachers (Admin & Teacher)
router.get('/', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const sql = `
    SELECT t.*, u.username 
    FROM teachers t
    LEFT JOIN users u ON t.user_id = u.id
    ORDER BY t.last_name ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single teacher (Admin, Teacher, or self)
router.get('/:id', authMiddleware, (req, res) => {
  // Check if user is admin, teacher, or the teacher themselves
  if (req.user.role === 'teacher' && req.user.userId != req.params.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const sql = `
    SELECT t.*, u.username 
    FROM teachers t
    LEFT JOIN users u ON t.user_id = u.id
    WHERE t.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Teacher not found' });
    res.json(result[0]);
  });
});

// CREATE teacher (Admin only)
router.post('/', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const {
    user_id,
    teacher_code,
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    contact,
    address,
    specialization,
    status
  } = req.body;

  // Check required fields
  if (!user_id || !teacher_code || !first_name || !last_name || !email || !gender || !contact) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  // Check if teacher_code already exists
  db.query('SELECT * FROM teachers WHERE teacher_code = ?', [teacher_code], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) return res.status(400).json({ message: 'Teacher code already exists' });

    // Check if email already exists
    db.query('SELECT * FROM teachers WHERE email = ?', [email], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length > 0) return res.status(400).json({ message: 'Email already exists' });

      const sql = `
        INSERT INTO teachers (
          user_id, teacher_code, first_name, middle_name, last_name, 
          email, gender, contact, address, specialization, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(sql, [user_id, teacher_code, first_name, middle_name, last_name, email, gender, contact, address, specialization, status || 'active'], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'Teacher created successfully', id: result.insertId });
      });
    });
  });
});

// UPDATE teacher (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    contact,
    address,
    specialization,
    status
  } = req.body;

  const sql = `
    UPDATE teachers 
    SET first_name = ?, middle_name = ?, last_name = ?, email = ?, 
        gender = ?, contact = ?, address = ?, specialization = ?, status = ?
    WHERE id = ?
  `;
  
  db.query(sql, [first_name, middle_name, last_name, email, gender, contact, address, specialization, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher updated successfully' });
  });
});

// DELETE teacher (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  db.query('DELETE FROM teachers WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted successfully' });
  });
});

module.exports = router;