const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const { loginLimiter } = require("../middlewares/rateLimiter");
const logApiRequest = require("../middlewares/logMiddleware");

const {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  deactivateUser,
  showActiveUsers,
  showDeactivatedUsers,
  showAllStudentUsers,
  showAllTeacherUsers,
} = require("../controllers/userController");

// Users Route
// Users Route
router.post("/create", logApiRequest, createUser); // public
router.post("/login", loginLimiter, logApiRequest, loginUser); // public with rate limit
router.post("/logout", logApiRequest, authenticateToken, logoutUser); // protected
router.get("/me", logApiRequest, authenticateToken, getCurrentUser); // protected
router.patch(
  "/:id/deactivate",
  logApiRequest,
  authenticateToken,
  deactivateUser
); // protected
router.get("/active", logApiRequest, authenticateToken, showActiveUsers); // protected
router.get("/inactive", logApiRequest, authenticateToken, showDeactivatedUsers); // protected
router.get("/student", logApiRequest, authenticateToken, showAllStudentUsers); // protected
router.get("/teacher", logApiRequest, authenticateToken, showAllTeacherUsers); // protected

module.exports = router;
