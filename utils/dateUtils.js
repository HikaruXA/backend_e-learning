const { DateTime } = require("luxon");

/**
 * Converts a UTC Date to a specific timezone with formatted output.
 * @param {Date} date - UTC Date object.
 * @param {string} timezone - IANA timezone string (e.g., "Asia/Manila").
 * @returns {string} Formatted date in "MM/DD/YYYY hh:mm:ss a" format.
 */
const convertToTimezone = (date, timezone = "Asia/Manila") => {
  if (!date) return null;
  return DateTime.fromJSDate(date, { zone: "utc" })
    .setZone(timezone)
    .toFormat("MM/dd/yyyy hh:mm:ss a"); // e.g., 06/15/2025 03:15:00 PM
};

/**
 * Converts `created_at` and `updated_at` fields for a list of DB rows.
 * @param {Array} rows - The result rows from DB query.
 * @param {string} timezone - User's timezone.
 * @returns {Array} The new array with converted date fields.
 */
const convertTimestamps = (rows, timezone = "Asia/Manila") => {
  return rows.map((row) => {
    return {
      ...row,
      created_at: row.created_at
        ? convertToTimezone(row.created_at, timezone)
        : null,
      updated_at: row.updated_at
        ? convertToTimezone(row.updated_at, timezone)
        : null,
    };
  });
};

module.exports = {
  convertToTimezone,
  convertTimestamps,
};
