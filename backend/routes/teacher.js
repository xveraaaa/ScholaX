const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all teachers
router.get('/', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const sql = `
    SELECT t.*, u.username, c.campus_name
    FROM teachers t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN campuses c ON t.campus_id = c.id
    ORDER BY t.last_name ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// GET single teacher
router.get('/:id', authMiddleware, (req, res) => {
  const sql = `
    SELECT t.*, u.username, c.campus_name
    FROM teachers t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN campuses c ON t.campus_id = c.id
    WHERE t.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Teacher not found' });
    res.json(result[0]);
  });
});

// CREATE teacher (Admin only) - Auto creates user account
router.post('/', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  const {
    teacher_code,
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    contact,
    address,
    specialization,
    campus_id,
    status
  } = req.body;

  // Check required fields
  if (!teacher_code || !first_name || !last_name || !email || !gender || !contact) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    // Check if teacher_code already exists
    const existingTeacher = await db.promise().query('SELECT * FROM teachers WHERE teacher_code = ?', [teacher_code]);
    if (existingTeacher[0].length > 0) {
      return res.status(400).json({ message: 'Teacher code already exists' });
    }

    // Check if email already exists
    const existingEmail = await db.promise().query('SELECT * FROM teachers WHERE email = ?', [email]);
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

    // Default password is teacher_code
    const hashedPassword = await bcrypt.hash(teacher_code, 10);

      // Create user account
    const userResult = await db.promise().query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [finalUsername, hashedPassword, 'TEACHER']
    );
    
    const userId = userResult[0].insertId;

    // Create teacher profile
    const sql = `
      INSERT INTO teachers (
        user_id, teacher_code, first_name, middle_name, last_name, 
        email, gender, contact, address, specialization, campus_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.promise().query(sql, [
      userId, teacher_code, first_name, middle_name || null, last_name, 
      email, gender, contact, address || null, specialization || null, campus_id || null, status || 'active'
    ]);

    res.status(201).json({ 
      message: 'Teacher created successfully', 
      username: finalUsername,
      password: teacher_code,
      teacherId: teacher_code
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE teacher (Admin only)
router.put('/:id', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    contact,
    address,
    specialization,
    campus_id,
    status
  } = req.body;

  const sql = `
    UPDATE teachers 
    SET first_name = ?, middle_name = ?, last_name = ?, email = ?, 
        gender = ?, contact = ?, address = ?, specialization = ?, 
        campus_id = ?, status = ?
    WHERE id = ?
  `;
  
  db.query(sql, [first_name, middle_name, last_name, email, gender, contact, address, specialization, campus_id, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher updated successfully' });
  });
});

// DELETE teacher (Admin only)
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    // Get user_id
    const teacher = await db.promise().query('SELECT user_id FROM teachers WHERE id = ?', [req.params.id]);
    if (teacher[0].length === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    const userId = teacher[0][0].user_id;
    
    // Delete teacher profile
    await db.promise().query('DELETE FROM teachers WHERE id = ?', [req.params.id]);
    
    // Delete user account
    await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;