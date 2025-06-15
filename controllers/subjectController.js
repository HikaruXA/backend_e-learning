const db = require("../db");

// Create a new subject
const createSubject = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Subject name is required" });
  }

  const sql = `INSERT INTO subject (name, description) VALUES (?, ?)`;

  db.query(sql, [name, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(201).json({
      message: "Subject created successfully",
      subject_id: result.insertId,
    });
  });
};

// Get all subjects
const getAllSubjects = (req, res) => {
  const sql = `SELECT id, name, description FROM subject`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ error: "No subjects found" });
    }

    return res.json({
      message: "Subjects retrieved successfully",
      subjects: result,
    });
  });
};

// Update a subject
const updateSubject = (req, res) => {
  const subjectId = req.params.id;
  const { name, description } = req.body;

  const sql = `UPDATE subject SET name = ?, description = ?, updated_at = NOW() WHERE id = ?`;

  db.query(sql, [name, description, subjectId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    return res.json({ message: "Subject updated successfully" });
  });
};

// Delete a subject
const deleteSubject = (req, res) => {
  const subjectId = req.params.id;

  const sql = `DELETE FROM subject WHERE id = ?`;

  db.query(sql, [subjectId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    return res.json({ message: "Subject deleted successfully" });
  });
};

module.exports = {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
};
