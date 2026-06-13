const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all courses (everyone logged in)
router.get('/', authMiddleware, (req, res) => {
  const sql = `
    SELECT c.*, p.program_name, t.first_name, t.last_name 
    FROM courses c
    LEFT JOIN programs p ON c.program_id = p.id
    LEFT JOIN teachers t ON c.teacher_id = t.id
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
    SELECT c.*, p.program_name, t.first_name, t.last_name 
    FROM courses c
    LEFT JOIN programs p ON c.program_id = p.id
    LEFT JOIN teachers t ON c.teacher_id = t.id
    WHERE c.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Course not found' });
    res.json(result[0]);
  });
});

// CREATE course (Admin only)
router.post('/', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const {
    course_code,
    course_name,
    description,
    credits,
    program_id,
    teacher_id,
    academic_period,
    year_level,
    school_year,
    schedule,
    room,
    status
  } = req.body;

  if (!course_code || !course_name || !credits || !academic_period || !school_year) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  // Check if course_code exists
  db.query('SELECT * FROM courses WHERE course_code = ?', [course_code], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) return res.status(400).json({ message: 'Course code already exists' });

    const sql = `
      INSERT INTO courses (
        course_code, course_name, description, credits, program_id, 
        teacher_id, academic_period, year_level, school_year, schedule, room, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(sql, [course_code, course_name, description, credits, program_id, teacher_id, academic_period, year_level, school_year, schedule, room, status || 'active'], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Course created successfully', id: result.insertId });
    });
  });
});

// UPDATE course (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const {
    course_code,
    course_name,
    description,
    credits,
    program_id,
    teacher_id,
    academic_period,
    year_level,
    school_year,
    schedule,
    room,
    status
  } = req.body;

  const sql = `
    UPDATE courses 
    SET course_code = ?, course_name = ?, description = ?, credits = ?, 
        program_id = ?, teacher_id = ?, academic_period = ?, year_level = ?, 
        school_year = ?, schedule = ?, room = ?, status = ?
    WHERE id = ?
  `;
  
  db.query(sql, [course_code, course_name, description, credits, program_id, teacher_id, academic_period, year_level, school_year, schedule, room, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course updated successfully' });
  });
});

// DELETE course (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
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
    ORDER BY year_level, trimester
  `;
  
  db.query(sql, [req.params.program_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET courses by teacher
router.get('/teacher/:teacher_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT * FROM courses 
    WHERE teacher_id = ? 
    ORDER BY school_year, academic_period
  `;
  
  db.query(sql, [req.params.teacher_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;