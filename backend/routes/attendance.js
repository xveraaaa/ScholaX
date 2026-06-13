const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all attendance (Admin & Teacher)
router.get('/', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const sql = `
    SELECT a.*, 
           s.student_id, s.first_name as student_first, s.last_name as student_last,
           c.course_code, c.course_name,
           t.first_name as teacher_first, t.last_name as teacher_last
    FROM attendance a
    LEFT JOIN enrollments e ON a.enrollment_id = e.id
    LEFT JOIN students s ON e.student_id = s.id
    LEFT JOIN courses c ON e.course_id = c.id
    LEFT JOIN teachers t ON a.recorded_by = t.id
    ORDER BY a.date DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET attendance by student (Student sees only their own)
router.get('/student/:student_id', authMiddleware, (req, res) => {
  // Check if student is viewing their own attendance
  if (req.user.role === 'student') {
    db.query('SELECT user_id FROM students WHERE id = ?', [req.params.student_id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: 'Student not found' });
      if (result[0].user_id !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      getAttendance();
    });
  } else {
    getAttendance();
  }

  function getAttendance() {
    const sql = `
      SELECT a.*, 
             c.course_code, c.course_name,
             e.school_year, e.academic_period
      FROM attendance a
      LEFT JOIN enrollments e ON a.enrollment_id = e.id
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
      ORDER BY a.date DESC
    `;
    
    db.query(sql, [req.params.student_id], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    });
  }
});

// GET attendance by course (Teacher sees their course attendance)
router.get('/course/:course_id', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const sql = `
    SELECT a.*, 
           s.student_id, s.first_name, s.last_name,
           a.date, a.status, a.time_in, a.time_out, a.remarks
    FROM attendance a
    LEFT JOIN enrollments e ON a.enrollment_id = e.id
    LEFT JOIN students s ON e.student_id = s.id
    WHERE e.course_id = ?
    ORDER BY a.date DESC, s.last_name ASC
  `;
  
  db.query(sql, [req.params.course_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET attendance by enrollment (specific student in specific course)
router.get('/enrollment/:enrollment_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT a.*, 
           s.student_id, s.first_name, s.last_name,
           c.course_code, c.course_name
    FROM attendance a
    LEFT JOIN enrollments e ON a.enrollment_id = e.id
    LEFT JOIN students s ON e.student_id = s.id
    LEFT JOIN courses c ON e.course_id = c.id
    WHERE a.enrollment_id = ?
    ORDER BY a.date DESC
  `;
  
  db.query(sql, [req.params.enrollment_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single attendance record
router.get('/:id', authMiddleware, (req, res) => {
  const sql = `
    SELECT a.*, 
           s.student_id, s.first_name, s.last_name,
           c.course_code, c.course_name
    FROM attendance a
    LEFT JOIN enrollments e ON a.enrollment_id = e.id
    LEFT JOIN students s ON e.student_id = s.id
    LEFT JOIN courses c ON e.course_id = c.id
    WHERE a.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Attendance record not found' });
    res.json(result[0]);
  });
});

// CREATE attendance (Teacher only)
router.post('/', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const { enrollment_id, date, status, time_in, time_out, remarks } = req.body;

  if (!enrollment_id || !date || !status) {
    return res.status(400).json({ message: 'Enrollment ID, date, and status are required' });
  }

  // Check if attendance already exists for this enrollment and date
  db.query(
    'SELECT * FROM attendance WHERE enrollment_id = ? AND date = ?',
    [enrollment_id, date],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length > 0) {
        return res.status(400).json({ message: 'Attendance already recorded for this date' });
      }

      const sql = `
        INSERT INTO attendance (enrollment_id, date, status, time_in, time_out, remarks, recorded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(sql, [enrollment_id, date, status, time_in || null, time_out || null, remarks, req.user.userId], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'Attendance recorded successfully', id: result.insertId });
      });
    }
  );
});

// UPDATE attendance (Teacher only)
router.put('/:id', authMiddleware, authorizeRoles('admin', 'teacher'), (req, res) => {
  const { status, time_in, time_out, remarks } = req.body;

  const sql = `
    UPDATE attendance 
    SET status = ?, time_in = ?, time_out = ?, remarks = ?
    WHERE id = ?
  `;
  
  db.query(sql, [status, time_in || null, time_out || null, remarks, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Attendance record not found' });
    res.json({ message: 'Attendance updated successfully' });
  });
});

// DELETE attendance (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  db.query('DELETE FROM attendance WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Attendance record not found' });
    res.json({ message: 'Attendance deleted successfully' });
  });
});

// GET attendance summary by student (count of present/absent/late)
router.get('/summary/student/:student_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT 
      c.course_code,
      c.course_name,
      e.school_year,
      e.academic_period,
      SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
      SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
      SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_count,
      SUM(CASE WHEN a.status = 'excused' THEN 1 ELSE 0 END) as excused_count,
      COUNT(*) as total_days
    FROM attendance a
    LEFT JOIN enrollments e ON a.enrollment_id = e.id
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