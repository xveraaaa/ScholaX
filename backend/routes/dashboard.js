const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// ADMIN DASHBOARD
router.get('/admin', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const queries = {
    stats: `
      SELECT 
        (SELECT COUNT(*) FROM students) as students,
        (SELECT COUNT(*) FROM teachers) as teachers,
        (SELECT COUNT(*) FROM courses) as courses,
        (SELECT COUNT(*) FROM enrollments) as enrollments,
        (SELECT COUNT(*) FROM enrollments WHERE status = 'enrolled') as enrolledStudents,
        (SELECT COUNT(*) FROM programs) as programs,
        (SELECT COUNT(*) FROM campuses) as campuses
    `,
    activities: `
      (SELECT 'New student enrolled' as description, DATE(created_at) as date, created_at as sort_date 
       FROM enrollments ORDER BY created_at DESC LIMIT 3)
      UNION ALL
      (SELECT CONCAT('New course added: ', course_name) as description, DATE(created_at) as date, created_at as sort_date 
       FROM courses ORDER BY created_at DESC LIMIT 3)
      UNION ALL
      (SELECT 'New teacher hired' as description, DATE(created_at) as date, created_at as sort_date 
       FROM teachers ORDER BY created_at DESC LIMIT 3)
      ORDER BY sort_date DESC LIMIT 10
    `,
    announcements: `
      SELECT 'Welcome to ScholaX' as title, 'The new school year is starting soon. Get ready for an exciting semester!' as message, NOW() as date
      UNION ALL
      SELECT 'Grade Submission' as title, 'Faculty: Please submit your final grades by the end of the week.' as message, NOW() as date
      UNION ALL
      SELECT 'Enrollment Period' as title, 'Enrollment for next trimester is now open.' as message, NOW() as date
      LIMIT 5
    `
  };

  const results = {};
  let completed = 0;

  // Get stats
  db.query(queries.stats, (err, statsResult) => {
    if (err) {
      console.error(err);
      results.stats = {
        students: 0,
        teachers: 0,
        courses: 0,
        enrollments: 0,
        enrolledStudents: 0,
        programs: 0,
        campuses: 1
      };
    } else {
      results.stats = statsResult[0] || {
        students: 0,
        teachers: 0,
        courses: 0,
        enrollments: 0,
        enrolledStudents: 0,
        programs: 0,
        campuses: 1
      };
    }
    completed++;
    checkComplete();
  });

  // Get activities
  db.query(queries.activities, (err, activitiesResult) => {
    if (err) {
      console.error(err);
      results.activities = [];
    } else {
      results.activities = activitiesResult.map(a => ({
        description: a.description,
        date: a.date
      }));
    }
    completed++;
    checkComplete();
  });

  // Get announcements
  db.query(queries.announcements, (err, announcementsResult) => {
    if (err) {
      console.error(err);
      results.announcements = [];
    } else {
      results.announcements = announcementsResult;
    }
    completed++;
    checkComplete();
  });

  function checkComplete() {
    if (completed === 3) {
      res.json(results);
    }
  }
});

// TEACHER DASHBOARD
router.get('/teacher', authMiddleware, authorizeRoles('FACULTY'), (req, res) => {
  db.query('SELECT id FROM teachers WHERE user_id = ?', [req.user.userId], (err, teacherResult) => {
    if (err) return res.status(500).json({ message: err.message });
    if (teacherResult.length === 0) return res.status(404).json({ message: 'Teacher profile not found' });

    const teacherId = teacherResult[0].id;

    const queries = {
      myCourses: `
        SELECT c.*, COUNT(e.id) as student_count 
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.teacher_id = ?
        GROUP BY c.id
      `,
      totalStudents: `
        SELECT COUNT(DISTINCT e.student_id) as count 
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE c.teacher_id = ?
      `,
      todayAttendance: `
        SELECT COUNT(*) as count 
        FROM attendance a
        LEFT JOIN enrollments e ON a.enrollment_id = e.id
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE c.teacher_id = ? AND a.date = CURDATE()
      `,
      pendingGrades: `
        SELECT COUNT(*) as count 
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE c.teacher_id = ? 
        AND e.id NOT IN (SELECT DISTINCT enrollment_id FROM grades)
      `
    };

    const results = {};
    let completed = 0;

    Object.keys(queries).forEach(key => {
      db.query(queries[key], [teacherId], (err, result) => {
        if (err) {
          console.error(err);
          results[key] = key === 'myCourses' ? [] : [{ count: 0 }];
        } else {
          results[key] = result;
        }
        completed++;
        if (completed === Object.keys(queries).length) {
          res.json(results);
        }
      });
    });
  });
});

// STUDENT DASHBOARD
router.get('/student', authMiddleware, authorizeRoles('STUDENT'), (req, res) => {
  db.query('SELECT id FROM students WHERE user_id = ?', [req.user.userId], (err, studentResult) => {
    if (err) return res.status(500).json({ message: err.message });
    if (studentResult.length === 0) return res.status(404).json({ message: 'Student profile not found' });

    const studentId = studentResult[0].id;

    const queries = {
      myCourses: `
        SELECT c.*, t.first_name as teacher_first, t.last_name as teacher_last
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        LEFT JOIN teachers t ON c.teacher_id = t.id
        WHERE e.student_id = ? AND e.status = 'enrolled'
      `,
      currentGrades: `
        SELECT c.course_code, c.course_name, 
               ROUND(AVG((g.score / g.max_score) * g.percentage), 2) as average_grade
        FROM grades g
        LEFT JOIN enrollments e ON g.enrollment_id = e.id
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = ?
        GROUP BY c.id
      `,
      attendanceRate: `
        SELECT 
          SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
          SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent,
          SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late,
          COUNT(*) as total
        FROM attendance a
        LEFT JOIN enrollments e ON a.enrollment_id = e.id
        WHERE e.student_id = ?
      `,
      completedCredits: `
        SELECT SUM(c.credits) as total_credits
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = ? AND e.status = 'completed'
      `
    };

    const results = {};
    let completed = 0;

    Object.keys(queries).forEach(key => {
      db.query(queries[key], [studentId], (err, result) => {
        if (err) {
          console.error(err);
          results[key] = [];
        } else {
          results[key] = result;
        }
        completed++;
        if (completed === Object.keys(queries).length) {
          res.json(results);
        }
      });
    });
  });
});

module.exports = router;