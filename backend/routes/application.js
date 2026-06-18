const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");


// Submit new application with full details
router.post("/", async (req, res) => {
  try {
    const {
      firstName, lastName, middleName, email, phone,
      program, message, birthDate, gender, address, city,
      province, zipCode, nationality, religion, civilStatus,
      previousSchool, schoolAddress, yearGraduated, studentType,
      guardianName, guardianPhone, guardianEmail, guardianRelation,
      emergencyContactName, emergencyContactPhone, emergencyContactRelation
    } = req.body;

    // Check if email already exists
    const [existing] = await db.query(
      "SELECT id, status FROM applications WHERE email = ? AND status != 'rejected'",
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "An application with this email already exists"
      });
    }

    // Check if email is already a student
    const [studentExists] = await db.query(
      "SELECT id FROM students WHERE email = ?",
      [email]
    );
    
    if (studentExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered as a student"
      });
    }

    // Insert full application
    const [result] = await db.query(
      `INSERT INTO applications (
        first_name, last_name, middle_name, email, phone,
        program, message, birth_date, gender, address, city,
        province, zip_code, nationality, religion, civil_status,
        previous_school, school_address, year_graduated, student_type,
        guardian_name, guardian_phone, guardian_email, guardian_relation,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
        user_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName, lastName, middleName || null, email, phone,
        program, message || null, birthDate || null, gender || null, address || null,
        city || null, province || null, zipCode || null, nationality || null, 
        religion || null, civilStatus || null,
        previousSchool || null, schoolAddress || null, yearGraduated || null, studentType || null,
        guardianName || null, guardianPhone || null, guardianEmail || null, guardianRelation || null,
        emergencyContactName || null, emergencyContactPhone || null, emergencyContactRelation || null,
        null, // user_id initially null
        'pending'
      ]
    );
    
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application"
    });
  }
});

// Accept application and create full student record
router.put("/:id/accept", async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get application details
    const [application] = await connection.query(
      "SELECT * FROM applications WHERE id = ?",
      [req.params.id]
    );
    
    if (application.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const app = application[0];

    // Check if user already exists
    let [user] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [app.email]
    );

    let userId;
    let tempPassword = null;

    // Create user if doesn't exist
    if (user.length === 0) {
      // Generate temporary password
      tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      const [newUser] = await connection.query(
        "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
        [app.first_name, app.last_name, app.email, hashedPassword, 'student']
      );
      userId = newUser.insertId;
    } else {
      userId = user[0].id;
    }

    // Get program ID
    const [program] = await connection.query(
      "SELECT id FROM programs WHERE name = ? OR id = ?",
      [app.program, app.program]
    );

    // Generate student ID
    const studentId = await generateStudentId(connection);

    // Create full student record
    const [studentResult] = await connection.query(
      `INSERT INTO students (
        user_id, student_id, first_name, last_name, middle_name,
        birth_date, gender, email, phone, address, city,
        province, zip_code, nationality, religion, civil_status,
        program_id, year_level, student_type, enrollment_status,
        previous_school, school_address, year_graduated,
        guardian_name, guardian_phone, guardian_email, guardian_relation,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        studentId,
        app.first_name,
        app.last_name,
        app.middle_name || null,
        app.birth_date || null,
        app.gender || null,
        app.email,
        app.phone || null,
        app.address || null,
        app.city || null,
        app.province || null,
        app.zip_code || null,
        app.nationality || null,
        app.religion || null,
        app.civil_status || null,
        program.length > 0 ? program[0].id : null,
        '1st Year', // Default year level
        app.student_type || 'Freshman',
        'Enrolled', // Set as enrolled upon acceptance
        app.previous_school || null,
        app.school_address || null,
        app.year_graduated || null,
        app.guardian_name || null,
        app.guardian_phone || null,
        app.guardian_email || null,
        app.guardian_relation || null,
        app.emergency_contact_name || null,
        app.emergency_contact_phone || null,
        app.emergency_contact_relation || null
      ]
    );

    // Update application status
    await connection.query(
      "UPDATE applications SET status = 'accepted', user_id = ? WHERE id = ?",
      [userId, req.params.id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Application accepted and student created successfully",
      data: {
        studentId: studentId,
        studentId: studentResult.insertId,
        tempPassword: tempPassword // Only if new user was created
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error("Error accepting application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept application"
    });
  } finally {
    connection.release();
  }
});

// Get application with full details
router.get("/:id/full", async (req, res) => {
  try {
    const [application] = await db.query(
      `SELECT a.*, 
       CONCAT(u.first_name, ' ', u.last_name) as admin_name,
       u.email as admin_email
       FROM applications a
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [req.params.id]
    );
    
    if (application.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }
    
    res.json({
      success: true,
      data: application[0]
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch application"
    });
  }
});

// Get all applications with pagination and filters
router.get("/", async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT a.*, 
       CONCAT(u.first_name, ' ', u.last_name) as user_name 
       FROM applications a
       LEFT JOIN users u ON a.user_id = u.id
    `;
    let countQuery = "SELECT COUNT(*) as total FROM applications a";
    const params = [];
    
    if (status) {
      query += " WHERE a.status = ?";
      countQuery += " WHERE status = ?";
      params.push(status);
    }
    
    query += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));
    
    const [applications] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, status ? [status] : []);
    
    res.json({
      success: true,
      data: applications,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications"
    });
  }
});

// Reject application
router.put("/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;
    
    const [result] = await db.query(
      "UPDATE applications SET status = 'rejected', message = CONCAT(message, ' Rejection reason: ', ?) WHERE id = ?",
      [reason || 'No reason provided', req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }
    
    res.json({
      success: true,
      message: "Application rejected successfully"
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject application"
    });
  }
});

module.exports = router;