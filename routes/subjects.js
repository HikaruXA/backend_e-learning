const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const logApiRequest = require("../middlewares/logMiddleware");

const {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// Apply global middlewares
router.use(authenticateToken);
router.use(logApiRequest);
router.use(authorizeRole("admin"));

// Subject Routes
router.post("/create", createSubject);
router.get("/", getAllSubjects);
router.patch("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
