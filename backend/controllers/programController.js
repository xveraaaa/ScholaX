const db = require("../db");

// GET ALL PROGRAMS
exports.getPrograms = (req, res) => {
  db.query("SELECT * FROM programs ORDER BY program_name", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// GET PROGRAM BY ID
exports.getProgramById = (req, res) => {
  db.query(
    "SELECT * FROM programs WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Program not found",
        });
      }

      res.json(result[0]);
    },
  );
};

// CREATE PROGRAM
exports.createProgram = (req, res) => {
  const { program_code, program_name, description } = req.body;

  const sql = `
    INSERT INTO programs
    (
      program_code,
      program_name,
      description
    )
    VALUES (?, ?, ?)
  `;

  db.query(sql, [program_code, program_name, description], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Program created",
      id: result.insertId,
    });
  });
};

// UPDATE PROGRAM
exports.updateProgram = (req, res) => {
  const { program_code, program_name, description } = req.body;

  db.query(
    `
      UPDATE programs
      SET
        program_code = ?,
        program_name = ?,
        description = ?
      WHERE id = ?
    `,
    [program_code, program_name, description, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Program updated",
      });
    },
  );
};

// DELETE PROGRAM
exports.deleteProgram = (req, res) => {
  db.query("DELETE FROM programs WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Program deleted",
    });
  });
};
