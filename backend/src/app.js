const express = require("express");
const cors = require("cors");
const router = require("./api/v1/routes/index");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

// API Routes
app.use("/api/v1", router);

// Export app
module.exports = app;
