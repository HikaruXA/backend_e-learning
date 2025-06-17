const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authMiddleware");
const timezoneMiddleware = require("../middlewares/timezone");
const authorizeRole = require("../middlewares/roleMiddleware");
const logApiRequest = require("../middlewares/logMiddleware"); // ✅ Add this line

const {
  createLesson,
  getAllLessons,
  updateLesson,
  deactivateLesson,
} = require("../controllers/lessonController");

// ✅ Apply middleware
router.use(authenticateToken);
router.use(logApiRequest); // ✅ Logs after auth + role

// Lesson Routes
router.post("/create", createLesson);
router.get("/", timezoneMiddleware, getAllLessons);
router.patch("/:id", updateLesson);
router.patch("/:id/deactivate", deactivateLesson);

module.exports = router;
