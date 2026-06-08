const db = require("../db");

// GET ALL COURSES
exports.getCourses = (req, res) => {
  const sql = `
    SELECT
      c.id,
      c.course_code,
      c.course_name,
      c.description,
      c.units,
      c.teacher_id,
      t.employee_number,
      u.first_name,
      u.last_name
    FROM courses c
    LEFT JOIN teachers t
      ON c.teacher_id = t.id
    LEFT JOIN users u
      ON t.user_id = u.id
    ORDER BY c.course_code
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET COURSE BY ID
exports.getCourseById = (req, res) => {
  const sql = `
    SELECT *
    FROM courses
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(result[0]);
  });
};

// CREATE COURSE
exports.createCourse = (req, res) => {
  const { course_code, course_name, description, units, teacher_id } = req.body;

  const sql = `
    INSERT INTO courses
    (
      course_code,
      course_name,
      description,
      units,
      teacher_id
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [course_code, course_name, description, units, teacher_id || null],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Course created successfully",
        courseId: result.insertId,
      });
    },
  );
};

// UPDATE COURSE
exports.updateCourse = (req, res) => {
  const { course_code, course_name, description, units, teacher_id } = req.body;

  const sql = `
    UPDATE courses
    SET
      course_code = ?,
      course_name = ?,
      description = ?,
      units = ?,
      teacher_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [course_code, course_name, description, units, teacher_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Course updated successfully",
      });
    },
  );
};

// DELETE COURSE
exports.deleteCourse = (req, res) => {
  db.query("DELETE FROM courses WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Course deleted successfully",
    });
  });
};
