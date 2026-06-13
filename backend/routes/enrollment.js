const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all enrollments (Admin & Teacher)
router.get('/', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const sql = `
    SELECT e.*, 
           s.student_id, s.first_name as student_first, s.last_name as student_last,
           c.course_code, c.course_name,
           t.first_name as teacher_first, t.last_name as teacher_last
    FROM enrollments e
    LEFT JOIN students s ON e.student_id = s.id
    LEFT JOIN courses c ON e.course_id = c.id
    LEFT JOIN teachers t ON c.teacher_id = t.id
    ORDER BY e.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET enrollments by student (Student sees only their own)
router.get('/student/:student_id', authMiddleware, (req, res) => {
  // Check if student is viewing their own records
  if (req.user.role === 'student') {
    db.query('SELECT user_id FROM students WHERE id = ?', [req.params.student_id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: 'Student not found' });
      if (result[0].user_id !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      getEnrollments();
    });
  } else {
    getEnrollments();
  }

  function getEnrollments() {
    const sql = `
      SELECT e.*, 
             c.course_code, c.course_name, c.credits, c.schedule, c.room,
             t.first_name as teacher_first, t.last_name as teacher_last
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN teachers t ON c.teacher_id = t.id
      WHERE e.student_id = ?
      ORDER BY e.school_year DESC, e.academic_period ASC
    `;
    
    db.query(sql, [req.params.student_id], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    });
  }
});

// GET single enrollment
router.get('/:id', authMiddleware, (req, res) => {
  const sql = `
    SELECT e.*, 
           s.student_id, s.first_name as student_first, s.last_name as student_last,
           c.course_code, c.course_name
    FROM enrollments e
    LEFT JOIN students s ON e.student_id = s.id
    LEFT JOIN courses c ON e.course_id = c.id
    WHERE e.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Enrollment not found' });
    res.json(result[0]);
  });
});

// CREATE enrollment (Admin only)
router.post('/', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const { student_id, course_id, school_year, academic_period, status } = req.body;

  if (!student_id || !course_id || !school_year || !academic_period) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  // Check if already enrolled
  db.query(
    'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ? AND school_year = ? AND academic_period = ?',
    [student_id, course_id, school_year, academic_period],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length > 0) {
        return res.status(400).json({ message: 'Student already enrolled in this course' });
      }

      const sql = `
        INSERT INTO enrollments (student_id, course_id, school_year, academic_period, status)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.query(sql, [student_id, course_id, school_year, academic_period, status || 'enrolled'], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'Student enrolled successfully', id: result.insertId });
      });
    }
  );
});

// UPDATE enrollment (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const { status } = req.body;

  const sql = 'UPDATE enrollments SET status = ? WHERE id = ?';
  
  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Enrollment not found' });
    res.json({ message: 'Enrollment updated successfully' });
  });
});

// DELETE enrollment (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  // Check if grades exist
  db.query('SELECT * FROM grades WHERE enrollment_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) {
      return res.status(400).json({ message: 'Cannot delete enrollment with existing grades' });
    }

    db.query('DELETE FROM enrollments WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Enrollment not found' });
      res.json({ message: 'Enrollment deleted successfully' });
    });
  });
});

module.exports = router;