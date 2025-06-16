const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

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
router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticateToken, getCurrentUser);
router.patch("/:id/deactivate", deactivateUser);
router.get("/active", showActiveUsers);
router.get("/inactive", showDeactivatedUsers);
router.get("/student", showAllStudentUsers);
router.get("/teacher", showAllTeacherUsers);

module.exports = router;
