const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET; // store in .env for security

const createUser = async (req, res) => {
  const { first_name, last_name, email, password, profile_image, role } =
    req.body;

  if (!first_name || !last_name || !email || !password || !role) {
    res.locals.logMessage = "Missing required fields in user creation";
    return res
      .status(400)
      .json({
        error: "Missing required fields",
        message: res.locals.logMessage,
      });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

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
          res.locals.logMessage = "Duplicate email during user creation";
          return res
            .status(409)
            .json({
              error: "Email already exists",
              message: res.locals.logMessage,
            });
        }
        res.locals.logMessage = "Database error during user creation";
        return res
          .status(500)
          .json({ error: err.message, message: res.locals.logMessage });
      }

      res.locals.logMessage = "User added successfully";
      return res
        .status(201)
        .json({
          message: res.locals.logMessage,
          user_id: result.insertId,
          status: "Success",
        });
    });
  } catch (err) {
    res.locals.logMessage = "Bcrypt error during password hashing";
    return res
      .status(500)
      .json({
        error: "Error hashing password",
        message: res.locals.logMessage,
      });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.locals.logMessage = "Missing login credentials";
    return res
      .status(400)
      .json({
        error: "Email and password are required",
        message: res.locals.logMessage,
      });
  }

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      res.locals.logMessage = "Database error during login";
      return res
        .status(500)
        .json({ error: err.message, message: res.locals.logMessage });
    }

    if (results.length === 0) {
      res.locals.logMessage = "Email not found";
      return res
        .status(401)
        .json({
          error: "Invalid email or password",
          message: res.locals.logMessage,
        });
    }

    const user = results[0];

    if (user.is_active === 0) {
      res.locals.logMessage = "Deactivated user login attempt";
      return res
        .status(403)
        .json({
          error: "Account is deactivated",
          message: res.locals.logMessage,
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.locals.logMessage = "Incorrect password";
      return res
        .status(401)
        .json({
          error: "Invalid email or password",
          message: res.locals.logMessage,
        });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    delete user.password;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.locals.logMessage = "Login successful";
    return res.json({
      message: res.locals.logMessage,
      user,
      status: "Success",
    });
  });
};

const logoutUser = (req, res) => {
  res.locals.logMessage = "User logged out";
  res.clearCookie("token");
  res.json({ message: "Logged out successfully", status: "Success" });
};

const getCurrentUser = (req, res) => {
  const user = req.user;

  if (!user) {
    res.locals.logMessage = "Token missing or invalid";
    return res
      .status(401)
      .json({
        error: "User not authenticated",
        message: res.locals.logMessage,
      });
  }

  res.locals.logMessage = "Authenticated user retrieved successfully";
  return res.json({ message: res.locals.logMessage, user, status: "Success" });
};

const deactivateUser = (req, res) => {
  const userId = req.params.id;

  const sql = `UPDATE users SET is_active = 0 WHERE id = ?`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.locals.logMessage = "Failed to deactivate user";
      return res
        .status(500)
        .json({ error: err.message, message: res.locals.logMessage });
    }

    if (result.affectedRows === 0) {
      res.locals.logMessage = "User ID not found in database";
      return res
        .status(404)
        .json({ error: "User not found", message: res.locals.logMessage });
    }

    res.locals.logMessage = "User deactivated successfully";
    return res.json({ message: res.locals.logMessage, status: "Success" });
  });
};

const showActiveUsers = (req, res) => {
  const sql = `SELECT first_name, last_name, email, profile_image, role, created_at FROM users WHERE is_active = 1`;

  db.query(sql, (err, result) => {
    if (err) {
      res.locals.logMessage = "Failed to fetch active users";
      return res
        .status(500)
        .json({ error: err.message, message: res.locals.logMessage });
    }

    if (!result || result.length === 0) {
      res.locals.logMessage = "Active users table empty";
      return res
        .status(404)
        .json({
          error: "No available active users",
          message: res.locals.logMessage,
        });
    }

    res.locals.logMessage = "Retrieved active users successfully";
    return res.json({
      message: res.locals.logMessage,
      users: result,
      status: "Success",
    });
  });
};

const showDeactivatedUsers = (req, res) => {
  const sql = `SELECT first_name, last_name, email, profile_image, role, created_at FROM users WHERE is_active = 0`;

  db.query(sql, (err, result) => {
    if (err) {
      res.locals.logMessage = "Failed to fetch deactivated users";
      return res
        .status(500)
        .json({ error: err.message, message: res.locals.logMessage });
    }

    if (!result || result.length === 0) {
      res.locals.logMessage = "Deactivated users table empty";
      return res
        .status(404)
        .json({
          error: "No available deactivated users",
          message: res.locals.logMessage,
        });
    }

    res.locals.logMessage = "Retrieved deactivated users successfully";
    return res.json({
      message: res.locals.logMessage,
      users: result,
      status: "Success",
    });
  });
};

const showAllStudentUsers = (req, res) => {
  const sql = `SELECT first_name, last_name, email, profile_image, role, created_at FROM users WHERE is_active = 1 AND role = 'student'`;

  db.query(sql, (err, result) => {
    if (err) {
      res.locals.logMessage = "Failed to fetch student users";
      return res
        .status(500)
        .json({ error: err.message, message: res.locals.logMessage });
    }

    if (!result || result.length === 0) {
      res.locals.logMessage = "No students found";
      return res
        .status(404)
        .json({
          error: "No available active student users",
          message: res.locals.logMessage,
        });
    }

    res.locals.logMessage = "Retrieved student users successfully";
    return res.json({
      message: res.locals.logMessage,
      users: result,
      status: "Success",
    });
  });
};

const showAllTeacherUsers = (req, res) => {
  const sql = `SELECT first_name, last_name, email, profile_image, role, created_at FROM users WHERE is_active = 1 AND role = 'teacher'`;

  db.query(sql, (err, result) => {
    if (err) {
      res.locals.logMessage = "Failed to fetch teacher users";
      return res
        .status(500)
        .json({ error: err.message, message: res.locals.logMessage });
    }

    if (!result || result.length === 0) {
      res.locals.logMessage = "No teachers found";
      return res
        .status(404)
        .json({
          error: "No available active teacher users",
          message: res.locals.logMessage,
        });
    }

    res.locals.logMessage = "Retrieved teacher users successfully";
    return res.json({
      message: res.locals.logMessage,
      users: result,
      status: "Success",
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
