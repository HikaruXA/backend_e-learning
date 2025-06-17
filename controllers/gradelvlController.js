const db = require("../db");

// Create new grade level
const createGradeLevel = (req, res) => {
  const { level, description } = req.body;

  if (!level) {
    res.locals.logMessage = "Grade level creation failed: 'level' is required";
    return res.status(400).json({ error: "Grade level name is required" });
  }

  const sql = `
    INSERT INTO grade_level (level, description)
    VALUES (?, ?)
  `;

  db.query(sql, [level, description], (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while creating grade level: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    res.locals.logMessage = "Grade level created successfully";
    return res.status(201).json({
      message: res.locals.logMessage,
      grade_level_id: result.insertId,
    });
  });
};

// Get all active grade levels
const getActiveGradeLevels = (req, res) => {
  const sql = `SELECT * FROM grade_level WHERE is_active = 1`;

  db.query(sql, (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while fetching grade levels: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (!result || result.length === 0) {
      res.locals.logMessage = "No active grade levels found";
      return res.status(404).json({ error: "No active grade levels found" });
    }

    res.locals.logMessage = "Active grade levels retrieved successfully";
    return res.json({
      message: res.locals.logMessage,
      grade_levels: result,
    });
  });
};

// Update grade level
const updateGradeLevel = (req, res) => {
  const gradeLevelId = req.params.id;
  const { level, description } = req.body;

  if (!level) {
    res.locals.logMessage = "Grade level update failed: 'level' is required";
    return res.status(400).json({ error: "Grade level name is required" });
  }

  const sql = `
    UPDATE grade_level
    SET level = ?, description = ?
    WHERE id = ?
  `;

  db.query(sql, [level, description, gradeLevelId], (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while updating grade level: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = `Grade level with ID ${gradeLevelId} not found`;
      return res.status(404).json({ error: "Grade level not found" });
    }

    res.locals.logMessage = `Grade level with ID ${gradeLevelId} updated successfully`;
    return res.json({ message: res.locals.logMessage });
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
    if (err) {
      res.locals.logMessage = `Database error while deactivating grade level: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = `Grade level with ID ${gradeLevelId} not found`;
      return res.status(404).json({ error: "Grade level not found" });
    }

    res.locals.logMessage = `Grade level with ID ${gradeLevelId} deactivated successfully`;
    return res.json({ message: res.locals.logMessage });
  });
};

module.exports = {
  createGradeLevel,
  getActiveGradeLevels,
  updateGradeLevel,
  deactivateGradeLevel,
};
