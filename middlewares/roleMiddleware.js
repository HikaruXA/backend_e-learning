const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      res.locals.logMessage = "Access denied. No user information provided.";
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    if (req.user.role !== requiredRole) {
      res.locals.logMessage = `Access denied. User role '${req.user.role}' is not allowed. Required role: '${requiredRole}'`;
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

module.exports = authorizeRole;
