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
const Plants = require("./models/Plants")(sequelize, DataTypes);
const User = require("./models/User")(sequelize, DataTypes);
const Picture = require("./models/Picture")(sequelize, DataTypes);

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
    const { userId } = req.body;
    if (userId == null) {
      res.send("l'identifiant est incorrect");
    } else {
      const thisUser = await User.findOne({
        where: { id: userId },
      });
      if (thisUser) {
        const plants = await Plants.findAll({
          where: {
            userId: thisUser.id,
          },
        });
        let plantList = [];
        for (let i = 0; i < plants.length; i++) {
          let picture = await Picture.findOne({
            where: {
              plant_id: plants[i].id,
            },
          });
          if (picture == null) {
            picture =
              "https://upload.wikimedia.org/wikipedia/commons/6/6a/Exposition_Eug%C3%A8ne_Grasset_au_Salon_des_Cent.jpg";
          }
          plants[i].dataValues.picture = picture;
          delete plants[i].dataValues.createdAt;
          delete plants[i].dataValues.updatedAt;
          delete plants[i].dataValues.userId;
          plantList.push(plants[i]);
        }
        res.status(200).json(plantList);
      } else {
        res.status(404).send("Utilisateur non trouvé");
      }
    }
    res.send;
  } catch (error) {
    console.error("Erreur lors de la récupération des plantes:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la récupération des plantes.");
  }
});

app.post("/plant", async (req, res) => {
  try {
    const { userId, variety, movable, adress_id, request_id } = req.body;
    const plant = await Plants.create({
      variety: variety,
      movable: movable,
      adress_id: adress_id ? null : adress_id,
      request_id: request_id ? null : request_id,
      userId: userId,
    });
    res.send("plante ajoutée");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la plante:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de l'ajout de la plante.");
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
