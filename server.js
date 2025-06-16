require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const routes = require("./routes");

app.use(
  cors({
    origin: true, // IMPORTANT NOTE : Development process only!, Change from true to frontend URL in prod.
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
  res.json("Working backend");
});

// Routes
app.use("/e-learning", routes);

// Start server
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
