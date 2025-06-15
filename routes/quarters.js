const express = require("express");
const router = express.Router();

const {
  createQuarter,
  getAllQuarters,
  updateQuarter,
  deleteQuarter,
} = require("../controllers/quarterController");

// Quarters Route
router.post("/create", createQuarter);
router.get("/", getAllQuarters);
router.patch("/:id", updateQuarter);
router.delete("/:id", deleteQuarter);

module.exports = router;
