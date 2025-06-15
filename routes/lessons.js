const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authMiddleware");
const timezoneMiddleware = require("../middlewares/timezone");

const {
  createLesson,
  getAllLessons,
  updateLesson,
  deactivateLesson,
} = require("../controllers/lessonController");

// Middleware
router.use(authenticateToken);

// Lesson Routes
router.post("/create", createLesson);
router.get("/", timezoneMiddleware, getAllLessons);
router.patch("/:id", updateLesson);
router.patch("/:id/deactivate", deactivateLesson);

module.exports = router;
