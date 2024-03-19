// controllers/plantsController.js
const { User, Plant, Picture } = require("../models");


// Récupérer toutes les plantes
exports.getUserPlants = async (req, res) => {
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
      order: [["updatedAt", "DESC"]],
    });

    const plantList = await Promise.all(plants.map(async (plant) => {
      const picture = await Picture.findOne({
        where: { plant_id: plant.id },
      });

      return {
        ...plant.dataValues,
        picture: picture,
        createdAt: undefined,
        updatedAt: undefined,
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
  let newPlant = null;

  try {
    const { userId, adress_id, request_id, variety, movable, message } = req.body;
    const imageUrl = req.file.path; // Accès au fichier via multer

    // Première opération : création de la plante
    try {
      newPlant = await Plant.create({
        userId,
        adress_id,
        request_id,
        variety,
        movable,
      });
    } catch (error) {
      // Gestion de l'erreur lors de la création de la plante
      console.error("Erreur lors de la création de la plante", error);
      return res.status(500).send({
        message: "Erreur lors de la création de la plante.",
        error: process.env.NODE_ENV === "development" ? {
          message: error.message,
          stack: error.stack
        } : undefined
      });
    }

    // Deuxième opération : création de l'image
    try {
      const newPicture = await Picture.create({
        url: imageUrl,
        message,
        plant_id: newPlant.id,
        userId,
      });

      // Réponse en cas de succès
      return res.send({
        message: "Plante et image ajoutées avec succès",
        data: { ...newPlant.dataValues, picture: newPicture },
      });
    } catch (error) {
      // Gestion de l'erreur lors de la création de l'image
      console.error("Erreur lors de la création de l'image", error);

      // Tentative de nettoyage : suppression de la plante si l'image échoue
      if (newPlant) {
        await Plant.destroy({ where: { id: newPlant.id } });
        console.log(`La plante d'ID ${newPlant.id} a été supprimée suite à une erreur de création de l'image.`);
      }

      return res.status(500).send({
        message: "Erreur lors de la création de l'image.",
        error: process.env.NODE_ENV === "development" ? {
          message: error.message,
          stack: error.stack
        } : undefined
      });
    }
  } catch (error) {
    // Gestion d'erreur globale
    console.error("Erreur lors de l'ajout de la plante ou de l'image", error);
    return res.status(500).send({
      message: "Une erreur inattendue s'est produite.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};



module.exports = exports;
