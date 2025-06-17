const db = require("../db");

const logApiRequest = (req, res, next) => {
  const start = Date.now();

  // After response is sent
  res.on("finish", () => {
    const userId = req.user?.id || null;
    const endpoint = req.originalUrl;
    const method = req.method;
    const statusCode = res.statusCode;
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    // Infer result type based on status code
    let result = "Unknown";
    if (statusCode >= 200 && statusCode < 300) result = "Success";
    else if (statusCode === 401) result = "Unauthorized";
    else if (statusCode === 403) result = "Forbidden";
    else if (statusCode === 404) result = "Not Found";
    else if (statusCode >= 400 && statusCode < 500) result = "Client Error";
    else if (statusCode >= 500) result = "Server Error";

    const sql = `
      INSERT INTO api_logs 
      (user_id, endpoint, method, status_code, result, message, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const message = res.locals.logMessage || null; // Optional: set this manually in controllers

    db.query(sql, [
      userId,
      endpoint,
      method,
      statusCode,
      result,
      message,
      ipAddress,
      userAgent,
    ]);
  });

  next();
};

module.exports = logApiRequest;
