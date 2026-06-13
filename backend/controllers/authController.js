const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    // Check if username exists
    const checkSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkSql, [username], async (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length > 0) return res.status(400).json({ message: 'Username already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      
      db.query(sql, [username, hashedPassword, role], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: 'User not found' });

      const user = result[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
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
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL USERS (Admin only)
router.get('/users', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const sql = 'SELECT id, username, role, created_at, updated_at FROM users';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
});

// GET SINGLE USER (Admin only)
router.get('/users/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const sql = 'SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result[0]);
  });
});

// UPDATE USER (Admin only)
router.put('/users/:id', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const { username, role, password } = req.body;
    let sql = '';
    let params = [];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = 'UPDATE users SET username = ?, role = ?, password = ? WHERE id = ?';
      params = [username, role, hashedPassword, req.params.id];
    } else {
      sql = 'UPDATE users SET username = ?, role = ? WHERE id = ?';
      params = [username, role, req.params.id];
    }

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE USER (Admin only)
router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
});

// GET PROFILE (Logged in user)
router.get('/profile', authMiddleware, (req, res) => {
  const sql = 'SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?';
  db.query(sql, [req.user.userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result[0]);
  });
});

// UPDATE PROFILE (Logged in user)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, password } = req.body;
    let sql = '';
    let params = [];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = 'UPDATE users SET username = ?, password = ? WHERE id = ?';
      params = [username, hashedPassword, req.user.userId];
    } else {
      sql = 'UPDATE users SET username = ? WHERE id = ?';
      params = [username, req.user.userId];
    }

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;