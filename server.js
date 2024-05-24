const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const allowedOrigins = Object.keys(process.env)
  .filter(key => key.startsWith("FRONT_END_URL"))
  .map(key => process.env[key]);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// app.use((req, res, next) => {
//   console.log("Request Method:", req.method, "Request Origin:", req.headers.origin); // Log la méthode et l'origine de la requête
//   res.header("Access-Control-Allow-Origin", process.env.FRONT_END_URL);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization");
//   if (req.method === "OPTIONS") {
//     console.log("Preflight Request Headers:", req.headers); // Log les en-têtes des requêtes préflight
//     return res.sendStatus(204);
//   }
//   console.log("Request Headers:", req.headers); // Log les en-têtes des autres requêtes
//   next();
// });

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
