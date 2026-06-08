const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      username,
      first_name,
      middle_name,
      last_name,
      email,
      password,
      role,
    } = req.body;

    // Check required fields
    if (
      !username ||
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    // Check existing username
    const checkUsername = "SELECT * FROM users WHERE username = ?";

    db.query(checkUsername, [username], async (err, userResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: err.message,
        });
      }

      if (userResult.length > 0) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }

      // Check existing email
      const checkEmail = "SELECT * FROM users WHERE email = ?";

      db.query(checkEmail, [email], async (err, emailResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: err.message,
          });
        }

        if (emailResult.length > 0) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
              INSERT INTO users
              (
                username,
                first_name,
                middle_name,
                last_name,
                email,
                password,
                role
              )
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

        db.query(
          sql,
          [
            username,
            first_name,
            middle_name || null,
            last_name,
            email,
            hashedPassword,
            role,
          ],
          (err, result) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: err.message,
              });
            }

            res.status(201).json({
              message: "User registered successfully",
              userId: result.insertId,
            });
          },
        );
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
exports.login = (req, res) => {
  try {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = result[0];

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// PROFILE
exports.getProfile = (req, res) => {
  try {
    const sql = `
      SELECT
        id,
        username,
        first_name,
        middle_name,
        last_name,
        email,
        role,
        created_at
      FROM users
      WHERE id = ?
    `;

    db.query(sql, [req.user.userId], (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(result[0]);
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
