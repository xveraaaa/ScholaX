const db = require("../db");

// GET ALL STUDENTS
exports.getStudents = (req, res) => {
  const sql = `
    SELECT
      s.id,
      s.student_number,
      p.program_code,
      p.program_name,
      u.first_name,
      u.last_name,
      s.year_level,
      s.section,
      s.enrollment_status
    FROM students s
    JOIN users u ON s.user_id = u.id
    JOIN programs p ON s.program_id = p.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// GET STUDENT BY ID
exports.getStudentById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      s.*,
      u.first_name,
      u.middle_name,
      u.last_name,
      u.email,
      p.program_code,
      p.program_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    JOIN programs p ON s.program_id = p.id
    WHERE s.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(result[0]);
  });
};

// CREATE STUDENT RECORD
exports.createStudent = (req, res) => {
  const {
    user_id,
    student_number,
    program_id,
    year_level,
    section,
    enrollment_status,
  } = req.body;

  const sql = `
    INSERT INTO students
    (
      user_id,
      student_number,
      program_id,
      year_level,
      section,
      enrollment_status
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      student_number,
      program_id,
      year_level,
      section,
      enrollment_status,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Student created",
        studentId: result.insertId,
      });
    },
  );
};

// UPDATE STUDENT
exports.updateStudent = (req, res) => {
  const { id } = req.params;

  const { program_id, year_level, section, enrollment_status } = req.body;

  const sql = `
    UPDATE students
    SET
      program_id = ?,
      year_level = ?,
      section = ?,
      enrollment_status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [program_id, year_level, section, enrollment_status, id],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Student updated",
      });
    },
  );
};

// DELETE STUDENT
exports.deleteStudent = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Student deleted",
    });
  });
};
