const express = require("express");
const { Sequelize, DataTypes, where } = require("sequelize");
const http = require("http");

const app = express();
const port = 8080;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const sequelize = new Sequelize({
  sync: false,
  dialect: "sqlite",
  storage: "db.sqlite",
});

const Plant = require("./models/Plant")(sequelize, DataTypes);
const User = require("./models/User")(sequelize, DataTypes);

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Modèles synchronisés avec la base de données.");

    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  } catch (error) {
    console.error("Erreur lors de la synchronisation des modèles:", error);
  }
})();

app.get("/plants", async (req, res) => {
  try {
    console.log(req.body);
    const { variety } = req.body;
    console.log(variety);
    const plants = await Plant.findAll();
    res.json(plants);
  } catch (error) {
    console.error("Erreur lors de la récupération des plantes:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la récupération des plantes.");
  }
});

app.post("/plant", async (req, res) => {
  try {
    console.log(req.body);
    const { variety } = req.body;
    console.log(variety);
    const plants = await Plant.findAll();
    res.json(plants);
  } catch (error) {
    console.error("Erreur lors de la récupération des plantes:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la récupération des plantes.");
  }
});

app.get("/requests", async (req, res) => {
  try {
    console.log(req.body);
    const { variety } = req.body;
    console.log(variety);
    const plants = await Plant.findAll();
    res.json(plants);
  } catch (error) {
    console.error("Erreur lors de la récupération des plantes:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la récupération des plantes.");
  }
});

app.get("/plantsos", async (req, res) => {
  try {
    console.log(req.body);
    const { userId } = req.body;

    const user = await User.findOne();
    console.log(user);
    res.json(plants);
  } catch (error) {
    console.error("Erreur lors de la récupération des plantes:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la récupération des plantes.");
  }
});

app.post("/user", async (req, res) => {
  try {
    const { userId, email, password, pseudo, role, firstname, lastname } =
      req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user == null) {
      await User.create({
        email: email,
        password: password,
        pseudo: pseudo,
        role: role,
        firstname: firstname,
        lastname: lastname,
      });
      res.send("utilisateur ajouté");
    }
    res.send("l'utilisateur existe déjà");
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res.status(500).send("Erreur lors de la création de l'utilisateur.");
  }
});
