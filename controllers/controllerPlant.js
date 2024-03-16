// controllers/plantsController.js
const { User, Plant, Picture } = require("../models");

// Récupérer toutes les plantes
exports.getPlants = async (req, res) => {
  try {
    const userId = req.params.userId;

    const thisUser = await User.findOne({
      where: { id: userId },
    });

    if (!thisUser) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    const plants = await Plant.findAll({
      where: {
        userId: thisUser.id,
      },
    });

    const plantList = await Promise.all(plants.map(async (plant) => {
      const picture = await Picture.findOne({
        where: { plant_id: plant.id },
      });
      // || "https://upload.wikimedia.org/wikipedia/commons/6/6a/Exposition_Eug%C3%A8ne_Grasset_au_Salon_des_Cent.jpg";

      return {
        ...plant.dataValues,
        picture: picture,
        createdAt: undefined,
        updatedAt: undefined,
        userId: undefined,
      };
    }));

    res.status(200).json(plantList);
  } catch (error) {
    // console.error("Erreur lors de la récupération des plantes:", error);
    res.status(500).send({
      message: "Une erreur s'est produite lors de la récupération des plantes.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

// Ajouter une plante
exports.addPlant = async (req, res) => {
  try {
    const { userId, variety, movable, adress_id, request_id } = req.body;

    await Plant.create({
      variety,
      movable,
      adress_id: adress_id || null,
      request_id: request_id || null,
      userId,
    });

    res.send("Plante ajoutée");
  } catch (error) {
    // console.error("Erreur lors de l'ajout de la plante:", error);
    res.status(500).send({
      message: "Une erreur s'est produite lors de l'ajout de la plante.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

module.exports = exports;
