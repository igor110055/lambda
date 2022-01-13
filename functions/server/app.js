const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const createError = require("http-errors");
const rateLimit = require("express-rate-limit");

// configs imports
require("dotenv").config();
// require("./configs/mongoose");
const connectDb = require("./configs/mongoose");
// require("./configs/redis");

connectDb().then(() => {
  // console.log("db connected");
});

// routes
const routes = require("./routes");

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 60,
    max: 60,
  })
);

// fallback for local server
app.get("/", (req, res) => {
  return res.send({ message: "api root is located at /api" });
});

// bind api root to routes
app.use("/api", routes);

// catch all routes
app.use((req, res, next) => {
  // const error = new Error("Not found");
  // next(error);
  next(createError.NotFound());
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send({
    status,
    message: err.message,
  });
});

module.exports = app;
