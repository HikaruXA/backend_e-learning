const db = require("../db");

// Create a new quarter
const createQuarter = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Quarter name is required" });
  }

  const sql = `
    INSERT INTO quarter (name)
    VALUES (?)
  `;

  db.query(sql, [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(201).json({
      message: "Quarter created successfully",
      quarter_id: result.insertId,
    });
  });
};

// Get all quarters
const getAllQuarters = (req, res) => {
  const sql = `SELECT * FROM quarter`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No quarters found" });
    }

    return res.json({
      message: "Quarters retrieved successfully",
      quarters: result,
    });
  });
};

// Update a quarter
const updateQuarter = (req, res) => {
  const quarterId = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Quarter name is required" });
  }

  const sql = `
    UPDATE quarter
    SET name = ?
    WHERE id = ?
  `;

  db.query(sql, [name, quarterId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Quarter not found" });
    }

    return res.json({ message: "Quarter updated successfully" });
  });
};

// Delete a quarter
const deleteQuarter = (req, res) => {
  const quarterId = req.params.id;

  const sql = `
    DELETE FROM quarter
    WHERE id = ?
  `;

  db.query(sql, [quarterId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Quarter not found" });
    }

    return res.json({ message: "Quarter deleted successfully" });
  });
};

module.exports = {
  createQuarter,
  getAllQuarters,
  updateQuarter,
  deleteQuarter,
};
