const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// REGISTER (with automatic profile creation)
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      // Student fields
      student_id,
      first_name,
      middle_name,
      last_name,
      email,
      gender,
      date_of_birth,
      contact,
      address,
      program_id,
      // Teacher fields
      teacher_code,
      specialization
    } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    // Convert role to uppercase
    const upperRole = role.toUpperCase();

    // Check if role is valid
    if (!['ADMIN', 'FACULTY', 'STUDENT'].includes(upperRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if username exists
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length > 0) return res.status(400).json({ message: 'Username already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
        [username, hashedPassword, role], 
        async (err, userResult) => {
          if (err) return res.status(500).json({ message: err.message });
          
          const userId = userResult.insertId;
          
          // create profile based on role
          if (role === 'student') {
            // check required student fields
            if (!student_id || !first_name || !last_name || !email || !gender || !date_of_birth || !contact) {
              return res.status(400).json({ message: 'Missing required student fields' });
            }
            
            // Check if student_id exists
            db.query('SELECT * FROM students WHERE student_id = ?', [student_id], (err, result) => {
              if (err) return res.status(500).json({ message: err.message });
              if (result.length > 0) return res.status(400).json({ message: 'Student ID already exists' });
            });
            
            // Check if email exists
            db.query('SELECT * FROM students WHERE email = ?', [email], (err, result) => {
              if (err) return res.status(500).json({ message: err.message });
              if (result.length > 0) return res.status(400).json({ message: 'Email already exists' });
            });
            
            const studentSql = `
              INSERT INTO students (
                user_id, student_id, first_name, middle_name, last_name, 
                email, gender, date_of_birth, contact, address, program_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.query(studentSql, [userId, student_id, first_name, middle_name, last_name, email, gender, date_of_birth, contact, address, program_id || null], (err) => {
              if (err) return res.status(500).json({ message: err.message });
              res.status(201).json({ message: 'Student registered successfully', userId });
            });
            
          } else if (role === 'teacher') {
            // Check required teacher fields
            if (!teacher_code || !first_name || !last_name || !email || !gender || !contact) {
              return res.status(400).json({ message: 'Missing required teacher fields' });
            }
            
            // Check if teacher_code exists
            db.query('SELECT * FROM teachers WHERE teacher_code = ?', [teacher_code], (err, result) => {
              if (err) return res.status(500).json({ message: err.message });
              if (result.length > 0) return res.status(400).json({ message: 'Teacher code already exists' });
            });
            
            // Check if email exists
            db.query('SELECT * FROM teachers WHERE email = ?', [email], (err, result) => {
              if (err) return res.status(500).json({ message: err.message });
              if (result.length > 0) return res.status(400).json({ message: 'Email already exists' });
            });
            
            const teacherSql = `
              INSERT INTO teachers (
                user_id, teacher_code, first_name, middle_name, last_name, 
                email, gender, contact, address, specialization, status
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.query(teacherSql, [userId, teacher_code, first_name, middle_name, last_name, email, gender, contact, address, specialization || null, 'active'], (err) => {
              if (err) return res.status(500).json({ message: err.message });
              res.status(201).json({ message: 'Teacher registered successfully', userId });
            });
            
          } else if (role === 'admin') {
            // Admin doesn't need additional profile
            res.status(201).json({ message: 'Admin registered successfully', userId });
          } else {
            res.status(400).json({ message: 'Invalid role' });
          }
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN (returns profile info)
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: 'User not found' });

      const user = result[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Get profile info based on role
      let profile = null;
      
      if (user.role === 'student') {
        const profileResult = await db.promise().query('SELECT * FROM students WHERE user_id = ?', [user.id]);
        profile = profileResult[0][0];
      } else if (user.role === 'teacher') {
        const profileResult = await db.promise().query('SELECT * FROM teachers WHERE user_id = ?', [user.id]);
        profile = profileResult[0][0];
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          profile
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET PROFILE (with full details)
router.get('/profile', authMiddleware, (req, res) => {
  const sql = 'SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?';
  
  db.query(sql, [req.user.userId], (err, userResult) => {
    if (err) return res.status(500).json({ message: err.message });
    if (userResult.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const user = userResult[0];
    
    // Get profile based on role
    if (user.role === 'student') {
      db.query('SELECT * FROM students WHERE user_id = ?', [user.id], (err, profileResult) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ ...user, profile: profileResult[0] || null });
      });
    } else if (user.role === 'teacher') {
      db.query('SELECT * FROM teachers WHERE user_id = ?', [user.id], (err, profileResult) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ ...user, profile: profileResult[0] || null });
      });
    } else {
      res.json({ ...user, profile: null });
    }
  });
});

// GET ALL USERS (Admin only)
router.get('/users', authMiddleware, authorizeRoles('admin'), (req, res) => {
  db.query('SELECT id, username, role, created_at, updated_at FROM users', (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
});

// DELETE USER (Admin only)
router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;