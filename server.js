const express = require('express');
const cors = require('cors');

const app = express();

// var corsOptions = {
//   origin: 'http://localhost:3000'
// };
const corsOptions = {
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

const sequelize = new Sequelize('sqlite:memory:', {
  define: {
    freezeTableName: true
  }
});

require('./routes/routes.js')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;

const db = require('./models/index.js');

db.sequelize.sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message);
  });

// Supprimer les données de la base
/* db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and re-sync db.');
})
    .catch((err) => {
        console.log('Failed to Drop and re-sync db: ' + err.message);
    }); */

// SUPPRESSION DE TOUTE LA BASE DE DONNEES
// db.sequelize.drop();
//   console.log('All tables dropped!');
