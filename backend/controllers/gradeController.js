const db = require("../db");

// GET ALL GRADES
exports.getGrades = (req, res) => {
  const sql = `
    SELECT
      g.*,
      s.student_number,
      CONCAT(u.first_name, ' ', u.last_name) AS student_name,
      c.course_code,
      c.course_name
    FROM grades g
    JOIN students s ON g.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN courses c ON g.course_id = c.id
    ORDER BY student_name
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// GET GRADE BY ID
exports.getGradeById = (req, res) => {
  const sql = `
    SELECT *
    FROM grades
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Grade not found"
      });
    }

    res.json(result[0]);
  });
};

// CREATE GRADE
exports.createGrade = (req, res) => {
  const {
    student_id,
    course_id,
    prelim,
    midterm,
    finals
  } = req.body;

  if (
    prelim < 0 || prelim > 100 ||
    midterm < 0 || midterm > 100 ||
    finals < 0 || finals > 100
  ) {
    return res.status(400).json({
      message: "Grades must be between 0 and 100"
    });
  }

  const final_grade =
    (
      Number(prelim) +
      Number(midterm) +
      Number(finals)
    ) / 3;

  const remarks =
    final_grade >= 75
      ? "Passed"
      : "Failed";

  const sql = `
    INSERT INTO grades
    (
      student_id,
      course_id,
      prelim,
      midterm,
      finals,
      final_grade,
      remarks
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      student_id,
      course_id,
      prelim,
      midterm,
      finals,
      final_grade.toFixed(2),
      remarks
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Grade created successfully",
        gradeId: result.insertId,
        final_grade: final_grade.toFixed(2),
        remarks
      });
    }
  );
};

// UPDATE GRADE
exports.updateGrade = (req, res) => {
  const {
    prelim,
    midterm,
    finals
  } = req.body;

  const final_grade =
    (
      Number(prelim) +
      Number(midterm) +
      Number(finals)
    ) / 3;

  const remarks =
    final_grade >= 75
      ? "Passed"
      : "Failed";

  const sql = `
    UPDATE grades
    SET
      prelim = ?,
      midterm = ?,
      finals = ?,
      final_grade = ?,
      remarks = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      prelim,
      midterm,
      finals,
      final_grade.toFixed(2),
      remarks,
      req.params.id
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Grade updated successfully",
        final_grade: final_grade.toFixed(2),
        remarks
      });
    }
  );
};

// DELETE GRADE
exports.deleteGrade = (req, res) => {
  db.query(
    "DELETE FROM grades WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Grade deleted successfully"
      });
    }
  );
};