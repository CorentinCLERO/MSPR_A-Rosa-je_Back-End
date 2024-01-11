// const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite

// Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'db.sqlite'
// });

// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'sqlite'
// });

// try {
//   sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }



const express = require("express");
const cors = require("cors");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:3000"
// };
var corsOptions = {
  origin: function (origin, callback) {
    callback(null, true); // Autoriser toutes les sources
  }
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:', {
  define: {
    freezeTableName: true
  }
});

require("./app/routes/routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

/* db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
})
    .catch((err) => {
        console.log("Failed to Drop and re-sync db: " + err.message);
    }); */

// SUPPRESSION DE TOUTE LA BASE DE DONNEES
// db.sequelize.drop();
//   console.log("All tables dropped!");