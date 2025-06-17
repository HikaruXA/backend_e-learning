const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const logApiRequest = require("../middlewares/logMiddleware"); // 👈 Import log middleware

const {
  createGradeLevel,
  getActiveGradeLevels,
  updateGradeLevel,
  deactivateGradeLevel,
} = require("../controllers/gradelvlController");

// Apply authentication and authorization
router.use(authenticateToken);
router.use(logApiRequest);
router.use(authorizeRole("admin"));

// Grade Level Routes
router.post("/create", createGradeLevel);
router.get("/", getActiveGradeLevels);
router.patch("/:id", updateGradeLevel);
router.patch("/:id/deactivate", deactivateGradeLevel);

module.exports = router;
