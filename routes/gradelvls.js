const express = require("express");
const router = express.Router();

const {
  createGradeLevel,
  getActiveGradeLevels,
  updateGradeLevel,
  deactivateGradeLevel,
} = require("../controllers/gradelvlController");

// Grade Level Routes
router.post("/create", createGradeLevel);
router.get("/", getActiveGradeLevels);
router.patch("/:id", updateGradeLevel);
router.patch("/:id/deactivate", deactivateGradeLevel);

module.exports = router;
