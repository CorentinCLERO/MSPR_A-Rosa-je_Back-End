const express = require("express");
const { Sequelize, DataTypes, where } = require("sequelize");
const http = require("http");

const app = express();
const port = 8080;
const axios = require("axios");

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
const Request = require("./models/Request")(sequelize, DataTypes);
const Adress = require("./models/Adress")(sequelize, DataTypes);
const HelpRequest = require("./models/HelpRequest")(sequelize, DataTypes);

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

app.delete("/plant/:plantId", async (req, res) => {
  try {
    const plantId = req.params.plantId;

    const plant = await Plants.findByPk(plantId);
    if (!plant) {
      return res.status(404).send("Plante non trouvée");
    }

    // Supprimer la plante
    await Plants.destroy({
      where: {
        id: plantId,
      },
    });

    res.send("Plante supprimée avec succès");
  } catch (error) {
    console.error("Erreur lors de la suppression de la plante:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la suppression de la plante.");
  }
});

app.get("/requests", async (req, res) => {
  try {
    const { userId } = req.body;
    let requestList = [];
    const requests = await Request.findAll({
      where: {
        status: "mission",
      },
    });
    for (let i = 0; i < requests.length; i++) {
      let adress = await Adress.findOne({
        where: {
          id: requests[i].adress_id,
        },
      });
      if (adress == null) {
        adress = "adresse inconnue ";
      }
      const compactAdress =
        adress.number + adress.street + adress.city + adress.country;
      const convertedAdress = await geocodeAddress(compactAdress);
      requests[i].dataValues.latitude = convertedAdress.latitude;
      requests[i].dataValues.longitude = convertedAdress.longitude;
      delete requests[i].dataValues.createdAt;
      delete requests[i].dataValues.updatedAt;
      delete requests[i].dataValues.userId;
      requestList.push(requests[i]);
    }

    res.json(requestList);
  } catch (error) {
    console.error("Erreur lors de la récupération des plantes:", error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de la récupération des plantes.");
  }
});

app.get("/plantsos/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne();
    if (user == null) {
      res.send("l'utilisateur n'existe pas");
    }
    let plantSosList = [];
    const plantsos = await HelpRequest.findAll({
      where: {
        user_id: userId,
      },
    });

    for (let i = 0; i < plantsos.length; i++) {
      let picture = await Picture.findOne({
        where: {
          helpRequest_id: plantsos[i].id,
        },
      });
      if (picture == null) {
        picture =
          "https://upload.wikimedia.org/wikipedia/commons/6/6a/Exposition_Eug%C3%A8ne_Grasset_au_Salon_des_Cent.jpg";
      } else {
        picture = picture.url;
      }
      plantsos[i].dataValues.url = picture;
      let plant = await Plants.findOne({
        where: {
          id: plantsos[i].dataValues.plant_id,
        },
      });
      let plantName = plant.dataValues.variety;
      plantsos[i].dataValues.variety = plantName;
      plantSosList.push(plantsos[i]);
    }
    res.json(plantSosList);
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

async function geocodeAddress(address) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: "AIzaSyD3dE8mEFvs49nSZb-igDl8BXNB8obHAx8",
        },
      }
    );

    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error("Aucun résultat trouvé pour cette adresse.");
    }
  } catch (error) {
    throw new Error(
      "Erreur lors de la conversion de l'adresse en coordonnées : " +
        error.message
    );
  }
}
