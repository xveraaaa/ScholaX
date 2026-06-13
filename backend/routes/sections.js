const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all sections
router.get('/', authMiddleware, (req, res) => {
  const sql = `
    SELECT s.*, 
           c.course_code, c.course_name, c.credits,
           t.first_name as teacher_first, t.last_name as teacher_last,
           camp.campus_name, p.program_name
    FROM sections s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN teachers t ON c.teacher_id = t.id
    LEFT JOIN programs p ON c.program_id = p.id
    LEFT JOIN campuses camp ON p.campus_id = camp.id
    ORDER BY s.school_year DESC, s.academic_period ASC, s.section_code ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET sections by program
router.get('/program/:program_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT s.*, c.course_code, c.course_name
    FROM sections s
    LEFT JOIN courses c ON s.course_id = c.id
    WHERE c.program_id = ?
    ORDER BY s.section_code ASC
  `;
  
  db.query(sql, [req.params.program_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET sections by course
router.get('/course/:course_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT s.*, t.first_name, t.last_name
    FROM sections s
    LEFT JOIN teachers t ON s.teacher_id = t.id
    WHERE s.course_id = ?
    ORDER BY s.section_code
  `;
  
  db.query(sql, [req.params.course_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single section
router.get('/:id', authMiddleware, (req, res) => {
  const sql = `
    SELECT s.*, c.course_code, c.course_name, t.first_name, t.last_name
    FROM sections s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN teachers t ON c.teacher_id = t.id
    WHERE s.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Section not found' });
    res.json(result[0]);
  });
});

// CREATE section (Admin only)
router.post('/', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const { section_code, course_id, school_year, academic_period, schedule, room, max_students } = req.body;
  
  if (!section_code || !course_id || !school_year || !academic_period) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  
  // Check if section already exists
  db.query(
    'SELECT * FROM sections WHERE course_id = ? AND section_code = ? AND school_year = ? AND academic_period = ?',
    [course_id, section_code, school_year, academic_period],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length > 0) {
        return res.status(400).json({ message: 'Section already exists for this course and period' });
      }
      
      const sql = `INSERT INTO sections (section_code, course_id, school_year, academic_period, schedule, room, max_students) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.query(sql, [section_code, course_id, school_year, academic_period, schedule, room, max_students || 40], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'Section created successfully', id: result.insertId });
      });
    }
  );
});

// UPDATE section (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const { section_code, course_id, school_year, academic_period, schedule, room, max_students, status } = req.body;
  
  const sql = `UPDATE sections 
               SET section_code = ?, course_id = ?, school_year = ?, academic_period = ?, 
                   schedule = ?, room = ?, max_students = ?, status = ?
               WHERE id = ?`;
  
  db.query(sql, [section_code, course_id, school_year, academic_period, schedule, room, max_students, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Section not found' });
    res.json({ message: 'Section updated successfully' });
  });
});

// DELETE section (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  // Check if section has students
  db.query('SELECT * FROM students WHERE section_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length > 0) {
      return res.status(400).json({ message: 'Cannot delete section with enrolled students' });
    }
    
    db.query('DELETE FROM sections WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Section not found' });
      res.json({ message: 'Section deleted successfully' });
    });
  });
});

module.exports = router;