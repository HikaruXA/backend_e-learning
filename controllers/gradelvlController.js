const db = require("../db");

// Create new grade level
const createGradeLevel = (req, res) => {
  const { level, description } = req.body;

  if (!level) {
    return res.status(400).json({ error: "Grade level name is required" });
  }

  const sql = `
    INSERT INTO grade_level (level, description)
    VALUES (?, ?)
  `;

  db.query(sql, [level, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(201).json({
      message: "Grade level created successfully",
      grade_level_id: result.insertId,
    });
  });
};

// Get all active grade levels
const getActiveGradeLevels = (req, res) => {
  const sql = `SELECT * FROM grade_level WHERE is_active = 1`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No active grade levels found" });
    }

    return res.json({
      message: "Active grade levels retrieved successfully",
      grade_levels: result,
    });
  });
};

// Update grade level
const updateGradeLevel = (req, res) => {
  const gradeLevelId = req.params.id;
  const { level, description } = req.body;

  if (!level) {
    return res.status(400).json({ error: "Grade level name is required" });
  }

  const sql = `
    UPDATE grade_level
    SET level = ?, description = ?
    WHERE id = ?
  `;

  db.query(sql, [level, description, gradeLevelId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Grade level not found" });
    }

    return res.json({ message: "Grade level updated successfully" });
  });
};

// Deactivate grade level
const deactivateGradeLevel = (req, res) => {
  const gradeLevelId = req.params.id;

  const sql = `
    UPDATE grade_level
    SET is_active = 0
    WHERE id = ?
  `;

  db.query(sql, [gradeLevelId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Grade level not found" });
    }

    return res.json({ message: "Grade level deactivated successfully" });
  });
};

module.exports = {
  createGradeLevel,
  getActiveGradeLevels,
  updateGradeLevel,
  deactivateGradeLevel,
};
