const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./models");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log("------------------------------------------");
  console.log("Client connected : " + socket.id);
  console.log("------------------------------------------");
  
  socket.on("join_chat", userId => {
    socket.join(userId);
    console.log("------------------------------------------");
    console.log("Client chat with userId : " + userId);
    console.log("------------------------------------------");
  });
  
  socket.on("disconnect", () => {
    console.log("------------------------------------------");
    console.log("Client disconnected : " + socket.id);
    console.log("------------------------------------------");
  });
});

app.set("io", io);

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require("./routes/routesMobile.js")(app);
require("./routes/routesAdmin.js")(app);
require("./routes/routesConnection.js")(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.sequelize.sync().then(() => {
  console.log("Synced db.");
}).catch((err) => {
  console.log("Failed to sync db: " + err.message);
});

module.exports = {server, io};
