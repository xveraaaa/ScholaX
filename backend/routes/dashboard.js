const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// ADMIN DASHBOARD
router.get('/admin', authMiddleware, authorizeRoles('ADMIN'), (req, res) => {
  const queries = {
    // Stats - removed status column
    stats: `
      SELECT  
        (SELECT COUNT(*) FROM students) as students,
        (SELECT COUNT(*) FROM teachers) as teachers,
        (SELECT COUNT(*) FROM courses) as courses,
        (SELECT COUNT(*) FROM programs) as programs,
        (SELECT COUNT(*) FROM campuses) as campuses,
        (SELECT COUNT(*) FROM enrollments WHERE status = 'enrolled') as enrollments
    `,
    
    // Recent Students
    recentStudents: `
      SELECT id, student_id, first_name, last_name, email, created_at
      FROM students
      ORDER BY created_at DESC
      LIMIT 10
    `,
    
    // Recent Enrollments
    recentEnrollments: `
      SELECT e.id, e.status, e.academic_period, e.created_at,
             CONCAT(s.first_name, ' ', s.last_name) as student_name,
             c.course_code
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN courses c ON e.course_id = c.id
      ORDER BY e.created_at DESC
      LIMIT 10
    `,
    
    // Enrollment Trend (last 6 months)
    enrollmentTrend: `
      SELECT 
        DATE_FORMAT(created_at, '%b') as month,
        COUNT(*) as count
      FROM enrollments
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%b'), MONTH(created_at)
      ORDER BY MIN(created_at) ASC
    `,
    
    // Program Distribution
    programDistribution: `
      SELECT p.program_name, COUNT(s.id) as count
      FROM programs p
      LEFT JOIN students s ON p.id = s.program_id
      GROUP BY p.id
      ORDER BY count DESC
      LIMIT 6
    `,
    
    // Today's Attendance
    attendanceData: `
      SELECT 
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late
      FROM attendance
      WHERE date = CURDATE()
    `,
    
    // Pending Grades
    pendingGrades: `
      SELECT COUNT(DISTINCT e.id) as count
      FROM enrollments e
      LEFT JOIN grades g ON e.id = g.enrollment_id
      WHERE e.status = 'enrolled' AND g.id IS NULL
    `,
    
    // Today's Attendance Count
    todayAttendance: `
      SELECT COUNT(*) as count
      FROM attendance
      WHERE date = CURDATE()
    `
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.query(queries[key], (err, result) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        // Set default values on error
        if (key === 'stats') {
          results[key] = { students: 0, teachers: 0, courses: 0, programs: 0, campuses: 1, enrollments: 0 };
        } else if (key === 'attendanceData') {
          results[key] = { present: 0, absent: 0, late: 0 };
        } else if (key === 'pendingGrades') {
          results[key] = { count: 0 };
        } else if (key === 'todayAttendance') {
          results[key] = { count: 0 };
        } else {
          results[key] = [];
        }
      } else {
        // Handle different result types
        if (key === 'stats') {
          results[key] = result[0];
        } else if (key === 'attendanceData') {
          results[key] = result[0] || { present: 0, absent: 0, late: 0 };
        } else if (key === 'pendingGrades') {
          results[key] = result[0]?.count || 0;
        } else if (key === 'todayAttendance') {
          results[key] = result[0]?.count || 0;
        } else {
          results[key] = result;
        }
      }
      
      completed++;
      if (completed === total) {
        res.json(results);
      }
    });
  });
});

// FACULTY DASHBOARD
router.get('/faculty', authMiddleware, authorizeRoles('FACULTY'), (req, res) => {
  // Get teacher id from user id
  db.query('SELECT id FROM teachers WHERE user_id = ?', [req.user.userId], (err, teacherResult) => {
    if (err) return res.status(500).json({ message: err.message });
    if (teacherResult.length === 0) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const teacherId = teacherResult[0].id;

    const queries = {
      // My Courses
      myCourses: `
        SELECT c.*, COUNT(e.id) as student_count 
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.teacher_id = ?
        GROUP BY c.id
      `,
      
      // Total Students
      totalStudents: `
        SELECT COUNT(DISTINCT e.student_id) as count 
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE c.teacher_id = ?
      `,
      
      // Today's Attendance
      todayAttendance: `
        SELECT COUNT(*) as count 
        FROM attendance a
        LEFT JOIN enrollments e ON a.enrollment_id = e.id
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE c.teacher_id = ? AND a.date = CURDATE()
      `,
      
      // Pending Grades
      pendingGrades: `
        SELECT COUNT(*) as count 
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE c.teacher_id = ? 
        AND e.id NOT IN (SELECT DISTINCT enrollment_id FROM grades)
      `,
      
      // Recent Activity
      recentActivity: `
        (SELECT 'New grade submitted' as activity, created_at as date
         FROM grades g
         LEFT JOIN enrollments e ON g.enrollment_id = e.id
         LEFT JOIN courses c ON e.course_id = c.id
         WHERE c.teacher_id = ?
         ORDER BY g.created_at DESC LIMIT 5)
        UNION ALL
        (SELECT 'Attendance recorded' as activity, created_at as date
         FROM attendance a
         LEFT JOIN enrollments e ON a.enrollment_id = e.id
         LEFT JOIN courses c ON e.course_id = c.id
         WHERE c.teacher_id = ?
         ORDER BY a.created_at DESC LIMIT 5)
        ORDER BY date DESC
        LIMIT 10
      `
    };

    const results = {};
    let completed = 0;
    const total = Object.keys(queries).length;

    Object.keys(queries).forEach(key => {
      db.query(queries[key], [teacherId, teacherId], (err, result) => {
        if (err) {
          console.error(`Error fetching ${key}:`, err);
          results[key] = key === 'myCourses' ? [] : 0;
        } else {
          if (key === 'totalStudents' || key === 'todayAttendance' || key === 'pendingGrades') {
            results[key] = result[0]?.count || 0;
          } else {
            results[key] = result;
          }
        }
        
        completed++;
        if (completed === total) {
          res.json(results);
        }
      });
    });
  });
});

// STUDENT DASHBOARD
router.get('/student', authMiddleware, authorizeRoles('STUDENT'), (req, res) => {
  // Get student id from user id
  db.query('SELECT id FROM students WHERE user_id = ?', [req.user.userId], (err, studentResult) => {
    if (err) return res.status(500).json({ message: err.message });
    if (studentResult.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const studentId = studentResult[0].id;

    const queries = {
      // My Courses
      myCourses: `
        SELECT c.*, t.first_name as teacher_first, t.last_name as teacher_last,
               sec.section_code, sec.schedule, sec.room
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        LEFT JOIN teachers t ON c.teacher_id = t.id
        LEFT JOIN sections sec ON e.section_id = sec.id
        WHERE e.student_id = ? AND e.status = 'enrolled'
      `,
      
      // My Grades
      myGrades: `
        SELECT c.course_code, c.course_name, 
               ROUND(AVG((g.score / g.max_score) * g.percentage), 2) as average_grade
        FROM grades g
        LEFT JOIN enrollments e ON g.enrollment_id = e.id
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = ?
        GROUP BY c.id
      `,
      
      // Attendance Rate
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
      
      // Completed Credits
      completedCredits: `
        SELECT SUM(c.credits) as total_credits
        FROM enrollments e
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = ? AND e.status = 'completed'
      `
    };

    const results = {};
    let completed = 0;
    const total = Object.keys(queries).length;

    Object.keys(queries).forEach(key => {
      db.query(queries[key], [studentId], (err, result) => {
        if (err) {
          console.error(`Error fetching ${key}:`, err);
          results[key] = [];
        } else {
          if (key === 'attendanceRate') {
            results[key] = result[0] || { present: 0, absent: 0, late: 0, total: 0 };
          } else if (key === 'completedCredits') {
            results[key] = result[0]?.total_credits || 0;
          } else {
            results[key] = result;
          }
        }
        
        completed++;
        if (completed === total) {
          res.json(results);
        }
      });
    });
  });
});

// GENERAL STATS (for homepage)
router.get('/stats', authMiddleware, (req, res) => {
  const queries = {
    totalStudents: 'SELECT COUNT(*) as count FROM students',
    totalTeachers: 'SELECT COUNT(*) as count FROM teachers',
    totalCourses: 'SELECT COUNT(*) as count FROM courses',
    totalPrograms: 'SELECT COUNT(*) as count FROM programs',
    totalCampuses: 'SELECT COUNT(*) as count FROM campuses'
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.query(queries[key], (err, result) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        results[key] = 0;
      } else {
        results[key] = result[0]?.count || 0;
      }
      
      completed++;
      if (completed === total) {
        res.json(results);
      }
    });
  });
});

module.exports = router;