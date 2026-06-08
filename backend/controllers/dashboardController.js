const db = require("../db");

exports.getStats = async (req, res) => {
  try {
    const stats = {};

    db.query("SELECT COUNT(*) AS total FROM students", (err, students) => {
      if (err) {
        return res.status(500).json(err);
      }

      stats.students = students[0].total;

      db.query("SELECT COUNT(*) AS total FROM teachers", (err, teachers) => {
        stats.teachers = teachers[0].total;

        db.query("SELECT COUNT(*) AS total FROM courses", (err, courses) => {
          stats.courses = courses[0].total;

          db.query(
            "SELECT COUNT(*) AS total FROM enrollments",
            (err, enrollments) => {
              stats.enrollments = enrollments[0].total;

              res.json(stats);
            },
          );
        });
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
