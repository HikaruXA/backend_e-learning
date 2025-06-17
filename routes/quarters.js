const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const logApiRequest = require("../middlewares/logMiddleware");

const {
  createQuarter,
  getAllQuarters,
  updateQuarter,
  deleteQuarter,
} = require("../controllers/quarterController");

// Apply authentication and logging first
router.use(authenticateToken);
router.use(logApiRequest); // 👈 Moved BEFORE role check
router.use(authorizeRole("admin")); // 👈 Still protects the route

// Quarter routes
router.post("/create", createQuarter);
router.get("/", getAllQuarters);
router.patch("/:id", updateQuarter);
router.delete("/:id", deleteQuarter);

module.exports = router;
