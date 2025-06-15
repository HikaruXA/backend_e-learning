const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Working backend");
});

// All API routes are prefixed with /e-learning
app.use("/e-learning", routes);

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
