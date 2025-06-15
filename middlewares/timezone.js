// middlewares/timezone.js
const timezoneMiddleware = (req, res, next) => {
  req.timezone =
    req.query.timezone || req.headers["x-timezone"] || "Asia/Manila";
  next(); // pass control to the next middleware/controller
};

module.exports = timezoneMiddleware;
