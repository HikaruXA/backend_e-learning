const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET; // store in .env for security

const createUser = async (req, res) => {
  const { first_name, last_name, email, password, profile_image, role } =
    req.body;

  // Validate required fields
  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const sql = `
      INSERT INTO users (first_name, last_name, email, password, profile_image, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,
      profile_image,
      role,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: err.message });
      }

      return res.status(201).json({
        message: "User added successfully",
        user_id: result.insertId,
      });
    });
  } catch (err) {
    return res.status(500).json({ error: "Error hashing password" });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    if (user.is_active === 0) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    delete user.password;

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({
      message: "Login successful",
      user,
    });
  });
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const getCurrentUser = (req, res) => {
  const user = req.user; // Set in auth middleware

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  return res.json({
    message: "Authenticated user retrieved successfully",
    user,
  });
};

const deactivateUser = (req, res) => {
  const userId = req.params.id;

  const sql = `
    UPDATE users
    SET is_active = 0
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User deactivated successfully" });
  });
};

const showActiveUsers = (req, res) => {
  const sql = `
    SELECT first_name, last_name, email, profile_image, role, created_at
    FROM users
    WHERE is_active = 1
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No available active users" });
    }

    return res.json({
      message: "Retrieved users successfully!",
      users: result,
    });
  });
};

const showDeactivatedUsers = (req, res) => {
  const sql = `
    SELECT first_name, last_name, email, profile_image, role, created_at
    FROM users
    WHERE is_active = 0
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No available deactivated users" });
    }

    return res.json({
      message: "Retrieved users successfully!",
      users: result,
    });
  });
};

const showAllStudentUsers = (req, res) => {
  const sql = `
    SELECT first_name, last_name, email, profile_image, role, created_at
    FROM users
    WHERE is_active = 1 AND role = 'student'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No available active student users" });
    }

    return res.json({
      message: "Retrieved student users successfully!",
      users: result,
    });
  });
};

const showAllTeacherUsers = (req, res) => {
  const sql = `
    SELECT first_name, last_name, email, profile_image, role, created_at
    FROM users
    WHERE is_active = 1 AND role = 'teacher'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No available active teacher users" });
    }

    return res.json({
      message: "Retrieved teacher users successfully!",
      users: result,
    });
  });
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  deactivateUser,
  showActiveUsers,
  showDeactivatedUsers,
  showAllStudentUsers,
  showAllTeacherUsers,
};
