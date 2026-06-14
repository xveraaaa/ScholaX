const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  const { q, type } = req.query;
  
  if (!q || q.length < 2) {
    return res.json({ suggestions: [] });
  }

  const searchTerm = `%${q}%`;
  const results = {};

  try {
    // Search Students
    if (!type || type === 'students') {
      const students = await db.promise().query(`
        SELECT id, student_id, first_name, last_name, email, 'student' as type
        FROM students 
        WHERE student_id LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?
        LIMIT 5
      `, [searchTerm, searchTerm, searchTerm, searchTerm]);
      results.students = students[0];
    }

    // Search Teachers
    if (!type || type === 'teachers') {
      const teachers = await db.promise().query(`
        SELECT id, teacher_code, first_name, last_name, email, specialization, 'teacher' as type
        FROM teachers 
        WHERE teacher_code LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?
        LIMIT 5
      `, [searchTerm, searchTerm, searchTerm, searchTerm]);
      results.teachers = teachers[0];
    }

    // Search Courses
    if (!type || type === 'courses') {
      const courses = await db.promise().query(`
        SELECT id, course_code, course_name, credits, 'course' as type
        FROM courses 
        WHERE course_code LIKE ? OR course_name LIKE ?
        LIMIT 5
      `, [searchTerm, searchTerm]);
      results.courses = courses[0];
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;