const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = 8080;

// Configuration de Sequelize pour SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
});

const Plant = require("./models/Plant")(sequelize, DataTypes);
const User = require("./models/User");

// Synchronisation du modèle avec la base de données
(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Modèles synchronisés avec la base de données.");

    // Une fois la synchronisation terminée, commencez à écouter les requêtes HTTP
    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  } catch (error) {
    console.error("Erreur lors de la synchronisation des modèles:", error);
  }
})();

// Route pour récupérer toutes les plantes depuis la base de données
app.get("/plants", async (req, res) => {
  try {
    console.log("sr");
    const plants = await Plant.findAll();
    res.json(plants);
  } catch (error) {
    console.error("Erreur lors de la récupération des plantes:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la récupération des plantes.");
  }
});
