const express = require("express");
const cors = require("cors");
const router = require("./api/v1/routes/index");

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// API Routes
app.use("/api/v1", router);

// Export app
module.exports = app;
