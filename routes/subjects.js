const express = require("express");
const router = express.Router();

const {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// Subject Routes
router.post("/create", createSubject);
router.get("/", getAllSubjects);
router.patch("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
