const db = require("../db");

// Create a new subject
const createSubject = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.locals.logMessage = "Subject name is missing in request";
    return res.status(400).json({ error: "Subject name is required" });
  }

  const sql = `INSERT INTO subject (name, description) VALUES (?, ?)`;

  db.query(sql, [name, description], (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while creating subject: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    res.locals.logMessage = "Subject created successfully";
    return res.status(201).json({
      message: res.locals.logMessage,
      subject_id: result.insertId,
    });
  });
};

// Get all subjects
const getAllSubjects = (req, res) => {
  const sql = `SELECT id, name, description FROM subject`;

  db.query(sql, (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while retrieving subjects: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      res.locals.logMessage = "No subjects found in database";
      return res.status(404).json({ error: "No subjects found" });
    }

    res.locals.logMessage = "Subjects retrieved successfully";
    return res.json({
      message: res.locals.logMessage,
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
    if (err) {
      res.locals.logMessage = `Database error while updating subject: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = `Subject with ID ${subjectId} not found`;
      return res.status(404).json({ error: "Subject not found" });
    }

    res.locals.logMessage = `Subject with ID ${subjectId} updated successfully`;
    return res.json({ message: res.locals.logMessage });
  });
};

// Delete a subject
const deleteSubject = (req, res) => {
  const subjectId = req.params.id;

  const sql = `DELETE FROM subject WHERE id = ?`;

  db.query(sql, [subjectId], (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while deleting subject: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = `Subject with ID ${subjectId} not found`;
      return res.status(404).json({ error: "Subject not found" });
    }

    res.locals.logMessage = `Subject with ID ${subjectId} deleted successfully`;
    return res.json({ message: res.locals.logMessage });
  });
};

module.exports = {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
};
