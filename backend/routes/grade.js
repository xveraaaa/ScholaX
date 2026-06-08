const express = require("express");
const router = express.Router();

const {
  getGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
} = require("../controllers/gradeController");

router.get("/", getGrades);
router.get("/:id", getGradeById);
router.post("/", createGrade);
router.put("/:id", updateGrade);
router.delete("/:id", deleteGrade);

module.exports = router;
