const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all courses
router.get('/', authMiddleware, (req, res) => {
  const sql = `
    SELECT c.*, p.program_name, t.first_name, t.last_name, camp.campus_name
    FROM courses c
    LEFT JOIN programs p ON c.program_id = p.id
    LEFT JOIN teachers t ON c.teacher_id = t.id
    LEFT JOIN campuses camp ON c.campus_id = camp.id
    ORDER BY c.course_code ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single course
router.get('/:id', authMiddleware, (req, res) => {
  const sql = `
    SELECT c.*, p.program_name, t.first_name, t.last_name, camp.campus_name
    FROM courses c
    LEFT JOIN programs p ON c.program_id = p.id
    LEFT JOIN teachers t ON c.teacher_id = t.id
    LEFT JOIN campuses camp ON c.campus_id = camp.id
    WHERE c.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Course not found' });
    res.json(result[0]);
  });
});

// CREATE course (Admin only) - without semester
router.post('/', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const {
    course_code,
    course_name,
    description,
    credits,
    program_id,
    teacher_id,
    campus_id,
    year_level,
    status
  } = req.body;

  // Check required fields
  if (!course_code || !course_name || !credits) {
    return res.status(400).json({ message: 'Required fields missing: course_code, course_name, credits' });
  }

  // Check if course_code exists
  db.query('SELECT * FROM courses WHERE course_code = ?', [course_code], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) return res.status(400).json({ message: 'Course code already exists' });

    const sql = `
      INSERT INTO courses (
        course_code, course_name, description, credits, program_id, 
        teacher_id, campus_id, year_level, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(sql, [
      course_code, course_name, description || null, credits, program_id || null, 
      teacher_id || null, campus_id || null, year_level || 1, status || 'active'
    ], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Course created successfully', id: result.insertId });
    });
  });
});

// UPDATE course (Admin only) - without semester
router.put('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const {
    course_code,
    course_name,
    description,
    credits,
    program_id,
    teacher_id,
    campus_id,
    year_level,
    status
  } = req.body;

  const sql = `
    UPDATE courses 
    SET course_code = ?, course_name = ?, description = ?, credits = ?, 
        program_id = ?, teacher_id = ?, campus_id = ?, year_level = ?, status = ?
    WHERE id = ?
  `;
  
  db.query(sql, [
    course_code, course_name, description, credits, program_id, 
    teacher_id, campus_id, year_level, status, req.params.id
  ], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course updated successfully' });
  });
});

// DELETE course (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  // Check if course has enrollments
  db.query('SELECT * FROM enrollments WHERE course_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) {
      return res.status(400).json({ message: 'Cannot delete course with enrolled students' });
    }

    db.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
      res.json({ message: 'Course deleted successfully' });
    });
  });
});

// GET courses by program
router.get('/program/:program_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT * FROM courses 
    WHERE program_id = ? 
    ORDER BY year_level, course_code
  `;
  
  db.query(sql, [req.params.program_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET courses by campus
router.get('/campus/:campus_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT c.*, p.program_name
    FROM courses c
    LEFT JOIN programs p ON c.program_id = p.id
    WHERE c.campus_id = ?
    ORDER BY c.course_code ASC
  `;
  
  db.query(sql, [req.params.campus_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;