const db = require("../db");

// GET ALL TEACHERS
exports.getTeachers = (req, res) => {
  const sql = `
    SELECT
      t.id,
      t.employee_number,
      u.first_name,
      u.middle_name,
      u.last_name,
      u.email,
      t.department,
      t.specialization
    FROM teachers t
    JOIN users u ON t.user_id = u.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET TEACHER BY ID
exports.getTeacherById = (req, res) => {
  const sql = `
    SELECT
      t.*,
      u.first_name,
      u.middle_name,
      u.last_name,
      u.email
    FROM teachers t
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.json(result[0]);
  });
};

// CREATE TEACHER
exports.createTeacher = (req, res) => {
  const { user_id, employee_number, department, specialization } = req.body;

  const sql = `
    INSERT INTO teachers
    (
      user_id,
      employee_number,
      department,
      specialization
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, employee_number, department, specialization],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Teacher created",
        teacherId: result.insertId,
      });
    },
  );
};

// UPDATE TEACHER
exports.updateTeacher = (req, res) => {
  const { department, specialization } = req.body;

  const sql = `
    UPDATE teachers
    SET
      department = ?,
      specialization = ?
    WHERE id = ?
  `;

  db.query(sql, [department, specialization, req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Teacher updated",
    });
  });
};

// DELETE TEACHER
exports.deleteTeacher = (req, res) => {
  db.query("DELETE FROM teachers WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Teacher deleted",
    });
  });
};
