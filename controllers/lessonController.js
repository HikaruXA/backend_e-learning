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
    res.locals.logMessage = "Missing required fields for lesson creation";
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
    if (err) {
      res.locals.logMessage = `Database error while creating lesson: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    res.locals.logMessage = "Lesson created successfully";
    return res.status(201).json({
      message: res.locals.logMessage,
      lesson_id: result.insertId,
    });
  });
};

// Get all active lessons
const getAllLessons = (req, res) => {
  const userTimezone = req.timezone;

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
    if (err) {
      res.locals.logMessage = `Database error while retrieving lessons: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (!result || result.length === 0) {
      res.locals.logMessage = "No lessons found";
      return res.status(404).json({ error: "No lessons found" });
    }

    const lessons = convertTimestamps(result, userTimezone);
    res.locals.logMessage = "Lessons retrieved successfully";

    return res.json({
      message: res.locals.logMessage,
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
    if (err) {
      res.locals.logMessage = `Database error while updating lesson: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = `Lesson with ID ${lessonId} not found`;
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.locals.logMessage = `Lesson with ID ${lessonId} updated successfully`;
    return res.json({ message: res.locals.logMessage });
  });
};

// Soft delete (deactivate) a lesson
const deactivateLesson = (req, res) => {
  const lessonId = req.params.id;

  const sql = `UPDATE lesson SET is_active = 0 WHERE id = ?`;

  db.query(sql, [lessonId], (err, result) => {
    if (err) {
      res.locals.logMessage = `Database error while deactivating lesson: ${err.message}`;
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = `Lesson with ID ${lessonId} not found`;
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.locals.logMessage = `Lesson with ID ${lessonId} deactivated successfully`;
    return res.json({ message: res.locals.logMessage });
  });
};

module.exports = {
  createLesson,
  getAllLessons,
  updateLesson,
  deactivateLesson,
};
