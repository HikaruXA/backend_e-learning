const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");

const {
  createQuarter,
  getAllQuarters,
  updateQuarter,
  deleteQuarter,
} = require("../controllers/quarterController");

router.use(authenticateToken);
router.use(authorizeRole("admin"));

// Quarters Route
router.post("/create", createQuarter);
router.get("/", getAllQuarters);
router.patch("/:id", updateQuarter);
router.delete("/:id", deleteQuarter);

module.exports = router;
