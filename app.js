const express = require("express");
// require("./modelsv2");

// SECURITY
// const helmet = require("helmet");

const plantsRoutes = require("./routes/plants.js");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, baggage"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const db = require("./models/index.js");
app.use(async (req, res, next) => {
  res.locals.allDb = db;
  res.locals.db = db;
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use("/plants", plantsRoutes);

module.exports = app;
