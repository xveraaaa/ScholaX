const db = require("../db");

// GET ALL ATTENDANCE
exports.getAttendance = (req, res) => {
  const sql = `
    SELECT
      a.id,
      a.attendance_date,
      a.status,
      s.student_number,
      CONCAT(u.first_name, ' ', u.last_name) AS student_name,
      c.course_code,
      c.course_name
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN courses c ON a.course_id = c.id
    ORDER BY a.attendance_date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET ATTENDANCE BY ID
exports.getAttendanceById = (req, res) => {
  db.query(
    "SELECT * FROM attendance WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Attendance record not found"
        });
      }

      res.json(result[0]);
    }
  );
};

// CREATE ATTENDANCE
exports.createAttendance = (req, res) => {
  const {
    student_id,
    course_id,
    attendance_date,
    status
  } = req.body;

  const sql = `
    INSERT INTO attendance
    (
      student_id,
      course_id,
      attendance_date,
      status
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      student_id,
      course_id,
      attendance_date,
      status
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Attendance recorded successfully",
        attendanceId: result.insertId
      });
    }
  );
};

// UPDATE ATTENDANCE
exports.updateAttendance = (req, res) => {
  const {
    attendance_date,
    status
  } = req.body;

  const sql = `
    UPDATE attendance
    SET
      attendance_date = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      attendance_date,
      status,
      req.params.id
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Attendance updated successfully"
      });
    }
  );
};

// DELETE ATTENDANCE
exports.deleteAttendance = (req, res) => {
  db.query(
    "DELETE FROM attendance WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Attendance deleted successfully"
      });
    }
  );
};