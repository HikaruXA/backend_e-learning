const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.locals.logMessage = "Access denied. No token provided.";
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      res.locals.logMessage = "Access denied. Invalid or expired token.";
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = user; // Attach user info from token to request
    next();
  });
};

module.exports = authenticateToken;
