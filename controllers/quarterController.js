const db = require("../db");

// Create a new quarter
const createQuarter = (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.locals.logMessage = "Quarter name is missing in request";
    return res.status(400).json({ error: "Quarter name is required" });
  }

  const sql = `INSERT INTO quarter (name) VALUES (?)`;

  db.query(sql, [name], (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while creating quarter: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    res.locals.logMessage = "Quarter created successfully";
    return res.status(201).json({
      message: res.locals.logMessage,
      quarter_id: result.insertId,
    });
  });
};

// Get all quarters
const getAllQuarters = (req, res) => {
  const sql = `SELECT * FROM quarter`;

  db.query(sql, (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while retrieving quarters: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (!result || result.length === 0) {
      res.locals.logMessage = "No quarters found in database";
      return res.status(404).json({ error: "No quarters found" });
    }

    res.locals.logMessage = "Quarters retrieved successfully";
    return res.json({
      message: res.locals.logMessage,
      quarters: result,
    });
  });
};

// Update a quarter
const updateQuarter = (req, res) => {
  const quarterId = req.params.id;
  const { name } = req.body;

  if (!name) {
    res.locals.logMessage = "Quarter name is missing in update request";
    return res.status(400).json({ error: "Quarter name is required" });
  }

  const sql = `UPDATE quarter SET name = ? WHERE id = ?`;

  db.query(sql, [name, quarterId], (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while updating quarter: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = `Quarter with ID ${quarterId} not found`;
      return res.status(404).json({ error: "Quarter not found" });
    }

    res.locals.logMessage = `Quarter with ID ${quarterId} updated successfully`;
    return res.json({ message: res.locals.logMessage });
  });
};

// Delete a quarter
const deleteQuarter = (req, res) => {
  const quarterId = req.params.id;

  const sql = `DELETE FROM quarter WHERE id = ?`;

  db.query(sql, [quarterId], (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while deleting quarter: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = `Quarter with ID ${quarterId} not found`;
      return res.status(404).json({ error: "Quarter not found" });
    }

    res.locals.logMessage = `Quarter with ID ${quarterId} deleted successfully`;
    return res.json({ message: res.locals.logMessage });
  });
};

module.exports = {
  createQuarter,
  getAllQuarters,
  updateQuarter,
  deleteQuarter,
};
