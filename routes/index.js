const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const quarterRoutes = require("./quarters");
const gradeLvlRoutes = require("./gradelvls");
const subjectRoutes = require("./subjects");
const lessonsRoutes = require("./lessons");

// Prefix all routes with /e-learning
router.use("/users", userRoutes);
router.use("/quarters", quarterRoutes);
router.use("/grade-levels", gradeLvlRoutes);
router.use("/subjects", subjectRoutes);
router.use("/lessons", lessonsRoutes);

module.exports = router;
