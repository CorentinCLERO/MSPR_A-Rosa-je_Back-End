const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// const corsOptions = {
//   origin: process.env.FRONT_END_URL,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   credentials: true,
//   allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
//   optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions));
app.use(express.json());
const allowedOrigins = [process.env.FRONT_END_URL, "https://9000-idx-msprarosajeadmin-1716367498654.cluster-blu4edcrfnajktuztkjzgyxzek.cloudworkstations.dev", "http://localhost:5173/"];

app.use((req, res, next) => {
  console.log("Request Method:", req.method, "Request Origin:", req.headers.origin); // Log la méthode et l'origine de la requête
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization");
  if (req.method === "OPTIONS") {
    console.log("Preflight Request Headers:", req.headers); // Log les en-têtes des requêtes préflight
    return res.sendStatus(204);
  }
  console.log("Request Headers:", req.headers); // Log les en-têtes des autres requêtes
  next();
});

app.get("api/admin/test", (req, res) => {
  res.status(201).json({ message: "CORS test successful" });
});

require("./routes/routesMobile.js")(app);
require("./routes/routesAdmin.js")(app);
require("./routes/routesConnection.js")(app);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models/index.js");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

module.exports = server;
