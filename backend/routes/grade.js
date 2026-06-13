const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all grades (Admin & Teacher)
router.get('/', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const sql = `
    SELECT g.*, 
           s.student_id, s.first_name as student_first, s.last_name as student_last,
           c.course_code, c.course_name,
           t.first_name as teacher_first, t.last_name as teacher_last
    FROM grades g
    LEFT JOIN enrollments e ON g.enrollment_id = e.id
    LEFT JOIN students s ON e.student_id = s.id
    LEFT JOIN courses c ON e.course_id = c.id
    LEFT JOIN teachers t ON g.recorded_by = t.id
    ORDER BY g.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET grades by student (Student sees only their own)
router.get('/student/:student_id', authMiddleware, (req, res) => {
  // Check if student is viewing their own grades
  if (req.user.role === 'student') {
    db.query('SELECT user_id FROM students WHERE id = ?', [req.params.student_id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: 'Student not found' });
      if (result[0].user_id !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      getGrades();
    });
  } else {
    getGrades();
  }

  function getGrades() {
    const sql = `
      SELECT g.*, 
             c.course_code, c.course_name,
             e.school_year, e.academic_period
      FROM grades g
      LEFT JOIN enrollments e ON g.enrollment_id = e.id
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
      ORDER BY e.school_year DESC, e.academic_period ASC, g.grade_type ASC
    `;
    
    db.query(sql, [req.params.student_id], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    });
  }
});

// GET grades by course (Teacher sees their course grades)
router.get('/course/:course_id', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const sql = `
    SELECT g.*, 
           s.student_id, s.first_name, s.last_name,
           e.school_year, e.academic_period
    FROM grades g
    LEFT JOIN enrollments e ON g.enrollment_id = e.id
    LEFT JOIN students s ON e.student_id = s.id
    WHERE e.course_id = ?
    ORDER BY s.last_name ASC
  `;
  
  db.query(sql, [req.params.course_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single grade
router.get('/:id', authMiddleware, (req, res) => {
  const sql = `
    SELECT g.*, 
           s.student_id, s.first_name, s.last_name,
           c.course_code, c.course_name
    FROM grades g
    LEFT JOIN enrollments e ON g.enrollment_id = e.id
    LEFT JOIN students s ON e.student_id = s.id
    LEFT JOIN courses c ON e.course_id = c.id
    WHERE g.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Grade not found' });
    res.json(result[0]);
  });
});

// CREATE grade (Teacher only)
router.post('/', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const { enrollment_id, grade_type, score, max_score, percentage, remarks } = req.body;

  if (!enrollment_id || !grade_type || !score || !max_score || !percentage) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  // Check if grade already exists for this enrollment and type
  db.query(
    'SELECT * FROM grades WHERE enrollment_id = ? AND grade_type = ?',
    [enrollment_id, grade_type],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length > 0) {
        return res.status(400).json({ message: 'Grade already exists for this enrollment and type' });
      }

      const sql = `
        INSERT INTO grades (enrollment_id, grade_type, score, max_score, percentage, remarks, recorded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(sql, [enrollment_id, grade_type, score, max_score, percentage, remarks, req.user.userId], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'Grade recorded successfully', id: result.insertId });
      });
    }
  );
});

// UPDATE grade (Teacher only)
router.put('/:id', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const { score, max_score, percentage, remarks } = req.body;

  const sql = `
    UPDATE grades 
    SET score = ?, max_score = ?, percentage = ?, remarks = ?
    WHERE id = ?
  `;
  
  db.query(sql, [score, max_score, percentage, remarks, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Grade not found' });
    res.json({ message: 'Grade updated successfully' });
  });
});

// DELETE grade (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  db.query('DELETE FROM grades WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Grade not found' });
    res.json({ message: 'Grade deleted successfully' });
  });
});

// GET student's final grade summary
router.get('/summary/:student_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT 
      c.course_code,
      c.course_name,
      e.school_year,
      e.academic_period,
      AVG(CASE 
        WHEN g.grade_type = 'prelim' THEN (g.score / g.max_score) * g.percentage / 100
        WHEN g.grade_type = 'midterm' THEN (g.score / g.max_score) * g.percentage / 100
        WHEN g.grade_type = 'final' THEN (g.score / g.max_score) * g.percentage / 100
        ELSE 0
      END) * 100 as final_grade
    FROM grades g
    LEFT JOIN enrollments e ON g.enrollment_id = e.id
    LEFT JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ?
    GROUP BY c.id, e.school_year, e.academic_period
    ORDER BY e.school_year DESC, e.academic_period ASC
  `;
  
  db.query(sql, [req.params.student_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;