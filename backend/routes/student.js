const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all students with section info
router.get('/', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const sql = `
    SELECT s.*, 
           p.program_name, 
           c.campus_name,
           sec.section_code,
           sec.schedule,
           sec.room,
           co.course_code,
           co.course_name
    FROM students s
    LEFT JOIN programs p ON s.program_id = p.id
    LEFT JOIN campuses c ON s.campus_id = c.id
    LEFT JOIN sections sec ON s.section_id = sec.id
    LEFT JOIN courses co ON sec.course_id = co.id
    ORDER BY s.last_name ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single student
router.get('/:id', authMiddleware, (req, res) => {
  const sql = `
    SELECT s.*, 
           p.program_name, 
           c.campus_name,
           sec.section_code,
           sec.schedule,
           sec.room,
           co.course_code,
           co.course_name
    FROM students s
    LEFT JOIN programs p ON s.program_id = p.id
    LEFT JOIN campuses c ON s.campus_id = c.id
    LEFT JOIN sections sec ON s.section_id = sec.id
    LEFT JOIN courses co ON sec.course_id = co.id
    WHERE s.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Student not found' });
    res.json(result[0]);
  });
});

// CREATE student (Admin only) - Auto creates user account
router.post('/', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  const {
    student_id,
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    date_of_birth,
    contact,
    address,
    campus_id,
    program_id,
    section_id
  } = req.body;

  // Check required fields
  if (!student_id || !first_name || !last_name || !email || !gender || !date_of_birth || !contact) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    // Check if student_id already exists
    const existingStudent = await db.promise().query('SELECT * FROM students WHERE student_id = ?', [student_id]);
    if (existingStudent[0].length > 0) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    // Check if email already exists
    const existingEmail = await db.promise().query('SELECT * FROM students WHERE email = ?', [email]);
    if (existingEmail[0].length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create username from email (before @)
    let username = email.split('@')[0];
    
    // Check if username exists, if yes add random number
    let finalUsername = username;
    let usernameExists = await db.promise().query('SELECT * FROM users WHERE username = ?', [finalUsername]);
    let counter = 1;
    while (usernameExists[0].length > 0) {
      finalUsername = `${username}${counter}`;
      usernameExists = await db.promise().query('SELECT * FROM users WHERE username = ?', [finalUsername]);
      counter++;
    }

    // Default password is student_id
    const hashedPassword = await bcrypt.hash(student_id, 10);

    // Create user account
    const userResult = await db.promise().query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [finalUsername, hashedPassword, 'STUDENT']
    );
    
    const userId = userResult[0].insertId;

    // Create student profile
    const sql = `
      INSERT INTO students (
        user_id, student_id, first_name, middle_name, last_name, 
        email, gender, date_of_birth, contact, address, campus_id, program_id, section_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.promise().query(sql, [
      userId, student_id, first_name, middle_name || null, last_name, 
      email, gender, date_of_birth, contact, address || null, campus_id || null, program_id || null, section_id || null
    ]);

    // Update section current_students count
    if (section_id) {
      await db.promise().query(
        'UPDATE sections SET current_students = current_students + 1 WHERE id = ?',
        [section_id]
      );
    }

    res.status(201).json({ 
      message: 'Student created successfully', 
      username: finalUsername,
      password: student_id,
      studentId: student_id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE student (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    date_of_birth,
    contact,
    address,
    campus_id,
    program_id,
    section_id
  } = req.body;

  try {
    // Get old section_id to update counts
    const oldStudent = await db.promise().query('SELECT section_id FROM students WHERE id = ?', [req.params.id]);
    const oldSectionId = oldStudent[0][0]?.section_id;

    const sql = `
      UPDATE students 
      SET first_name = ?, middle_name = ?, last_name = ?, email = ?, 
          gender = ?, date_of_birth = ?, contact = ?, address = ?, 
          campus_id = ?, program_id = ?, section_id = ?
      WHERE id = ?
    `;
    
    await db.promise().query(sql, [first_name, middle_name, last_name, email, gender, date_of_birth, contact, address, campus_id, program_id, section_id, req.params.id]);

    // Update section current_students counts
    if (oldSectionId && oldSectionId !== section_id) {
      await db.promise().query('UPDATE sections SET current_students = current_students - 1 WHERE id = ?', [oldSectionId]);
    }
    if (section_id && section_id !== oldSectionId) {
      await db.promise().query('UPDATE sections SET current_students = current_students + 1 WHERE id = ?', [section_id]);
    }

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE student (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    // Get user_id and section_id
    const student = await db.promise().query('SELECT user_id, section_id FROM students WHERE id = ?', [req.params.id]);
    if (student[0].length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const userId = student[0][0].user_id;
    const sectionId = student[0][0].section_id;
    
    // Update section current_students count
    if (sectionId) {
      await db.promise().query('UPDATE sections SET current_students = current_students - 1 WHERE id = ?', [sectionId]);
    }
    
    // Delete student profile
    await db.promise().query('DELETE FROM students WHERE id = ?', [req.params.id]);
    
    // Delete user account
    await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// GET students by section
router.get('/section/:section_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT s.*, p.program_name
    FROM students s
    LEFT JOIN programs p ON s.program_id = p.id
    WHERE s.section_id = ?
    ORDER BY s.last_name ASC
  `;
  
  db.query(sql, [req.params.section_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET students by campus
router.get('/campus/:campus_id', authMiddleware, (req, res) => {
  const sql = `
    SELECT s.*, p.program_name, sec.section_code
    FROM students s
    LEFT JOIN programs p ON s.program_id = p.id
    LEFT JOIN sections sec ON s.section_id = sec.id
    WHERE s.campus_id = ?
    ORDER BY s.last_name ASC
  `;
  
  db.query(sql, [req.params.campus_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;