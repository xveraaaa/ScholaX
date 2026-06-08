const db = require("../db");

// GET ALL ENROLLMENTS
exports.getEnrollments = (req, res) => {
  const sql = `
    SELECT
      e.id,
      s.student_number,
      CONCAT(u.first_name, ' ', u.last_name) AS student_name,
      c.course_code,
      c.course_name,
      e.school_year,
      e.semester,
      e.enrolled_at
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN courses c ON e.course_id = c.id
    ORDER BY e.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET ENROLLMENT BY ID
exports.getEnrollmentById = (req, res) => {
  const sql = `
    SELECT *
    FROM enrollments
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    res.json(result[0]);
  });
};

// CREATE ENROLLMENT
exports.createEnrollment = (req, res) => {
  const { student_id, course_id, school_year, semester } = req.body;

  const sql = `
    INSERT INTO enrollments
    (
      student_id,
      course_id,
      school_year,
      semester
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [student_id, course_id, school_year, semester],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Enrollment created successfully",
        enrollmentId: result.insertId,
      });
    },
  );
};

// UPDATE ENROLLMENT
exports.updateEnrollment = (req, res) => {
  const { student_id, course_id, school_year, semester } = req.body;

  const sql = `
    UPDATE enrollments
    SET
      student_id = ?,
      course_id = ?,
      school_year = ?,
      semester = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [student_id, course_id, school_year, semester, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Enrollment updated successfully",
      });
    },
  );
};

// DELETE ENROLLMENT
exports.deleteEnrollment = (req, res) => {
  db.query("DELETE FROM enrollments WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Enrollment deleted successfully",
    });
  });
};
