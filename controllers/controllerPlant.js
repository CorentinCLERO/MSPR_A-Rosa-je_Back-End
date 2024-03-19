// controllers/plantsController.js
const { User, Plant, Picture } = require("../models");
const cloudinary = require("cloudinary").v2; // Assurez-vous que Cloudinary est correctement configuré


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

exports.deletePlant = async (req, res) => {
  try {
    const plantId = req.params.plantId;

    // Trouver l'entrée de l'image associée à la plante
    const picture = await Picture.findOne({
      where: { plant_id: plantId },
    });

    // Si une image est trouvée, supprimez-la de Cloudinary
    if (picture) {
      const publicId = extractPublicIdFromCloudinaryUrl(picture.url);
      console.log(`Suppression de l'image d'ID ${picture.id} de Cloudinary, public ID : ${publicId}`);

      const cloudinaryResult = await cloudinary.uploader.destroy(publicId, function(error, result) {
        console.log(result, error);
      });
      
      if (cloudinaryResult.result === "ok") {
        // Supprimer l'entrée de l'image de la base de données
        await Picture.destroy({ where: { id: picture.id } });
        console.log(`L'image d'ID ${picture.id} a été supprimée de la base de données.`);
      } else {
        console.log(`Échec de la suppression de l'image sur Cloudinary, public ID : ${publicId}`);
      }
    }

    // Supprimez l'entrée de la plante
    console.log(`Suppression de la plante d'ID ${plantId}`);
    await Plant.destroy({ where: { id: plantId } });

    res.status(200).send("Plante et image associée supprimées");
    console.log(`La plante d'ID ${plantId} et son image ont été supprimées.`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la plante et/ou de l'image :", error);
    res.status(500).send("Erreur lors de la suppression de la plante et/ou de l'image");
  }
};

function extractPublicIdFromCloudinaryUrl(url) {
  const regex = /upload(?:\/v\d+)?\/([^.]+)/;
  const matches = url.match(regex);

  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    console.error("L'URL fournie n'est pas une URL Cloudinary valide:", url);
    return "";
  }
}

module.exports = exports;
