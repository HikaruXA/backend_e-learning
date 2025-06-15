const db = require("../db");
const { convertTimestamps } = require("../utils/dateUtils");

// Create a new lesson
const createLesson = (req, res) => {
  const {
    grade_level_id,
    subject_id,
    user_id,
    quarter_id,
    title,
    description,
    difficulty,
    lesson_url,
  } = req.body;

  if (
    !grade_level_id ||
    !subject_id ||
    !user_id ||
    !quarter_id ||
    !title ||
    !difficulty
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO lesson (
      grade_level_id, subject_id, user_id, quarter_id,
      title, description, difficulty, lesson_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    grade_level_id,
    subject_id,
    user_id,
    quarter_id,
    title,
    description,
    difficulty,
    lesson_url,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(201).json({
      message: "Lesson created successfully",
      lesson_id: result.insertId,
    });
  });
};

// Get all active lessons
const getAllLessons = (req, res) => {
  const userTimezone = req.timezone; // now comes from middleware

  const sql = `
    SELECT l.*, 
           gl.level AS grade_level,
           s.name AS subject_name,
           u.first_name, u.last_name,
           q.name AS quarter_name
    FROM lesson l
    JOIN grade_level gl ON l.grade_level_id = gl.id
    JOIN subject s ON l.subject_id = s.id
    JOIN users u ON l.user_id = u.id
    JOIN quarter q ON l.quarter_id = q.id
    WHERE l.is_active = 1
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const lessons = convertTimestamps(result, userTimezone);

    return res.json({
      message: "Lessons retrieved successfully",
      lessons,
    });
  });
};

// Update a lesson
const updateLesson = (req, res) => {
  const lessonId = req.params.id;
  const {
    grade_level_id,
    subject_id,
    user_id,
    quarter_id,
    title,
    description,
    difficulty,
    lesson_url,
  } = req.body;

  const sql = `
    UPDATE lesson
    SET grade_level_id = ?, subject_id = ?, user_id = ?, quarter_id = ?,
        title = ?, description = ?, difficulty = ?, lesson_url = ?, updated_at = NOW()
    WHERE id = ?
  `;

  const values = [
    grade_level_id,
    subject_id,
    user_id,
    quarter_id,
    title,
    description,
    difficulty,
    lesson_url,
    lessonId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    return res.json({ message: "Lesson updated successfully" });
  });
};

// Soft delete (deactivate) a lesson
const deactivateLesson = (req, res) => {
  const lessonId = req.params.id;

  const sql = `UPDATE lesson SET is_active = 0 WHERE id = ?`;

  db.query(sql, [lessonId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    return res.json({ message: "Lesson deactivated successfully" });
  });
};

module.exports = {
  createLesson,
  getAllLessons,
  updateLesson,
  deactivateLesson,
};
