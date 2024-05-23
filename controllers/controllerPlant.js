const { User, Plant, Picture } = require("../models");
const cloudinary = require("cloudinary").v2;


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
    res.status(500).send({
      message: "Une erreur s'est produite lors de la récupération des plantes.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

exports.addPlant = async (req, res) => {
  let newPlant = null;

  try {
    const { userId, adress_id, request_id, variety, movable, message } = req.body;
    const imageUrl = req.file.path;

    try {
      newPlant = await Plant.create({
        userId,
        adress_id,
        request_id,
        variety,
        movable,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Erreur lors de la création de la plante.",
        error: process.env.NODE_ENV === "development" ? {
          message: error.message,
          stack: error.stack
        } : undefined
      });
    }

    try {
      const newPicture = await Picture.create({
        url: imageUrl,
        message,
        plant_id: newPlant.id,
        userId,
      });

      return res.send({
        message: "Plante et image ajoutées avec succès",
        data: { ...newPlant.dataValues, picture: newPicture },
      });
    } catch (error) {
      if (newPlant) {
        await Plant.destroy({ where: { id: newPlant.id } });
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

    const picture = await Picture.findOne({
      where: { plant_id: plantId },
    });

    if (picture) {
      const publicId = extractPublicIdFromCloudinaryUrl(picture.url);

      const cloudinaryResult = await cloudinary.uploader.destroy(publicId, function(error, result) {
      });
      
      if (cloudinaryResult.result === "ok") {
        await Picture.destroy({ where: { id: picture.id } });
      }
    }

    await Plant.destroy({ where: { id: plantId } });

    res.status(200).send("Plante et image associée supprimées");
  } catch (error) {
    res.status(500).send("Erreur lors de la suppression de la plante et/ou de l'image");
  }
};

function extractPublicIdFromCloudinaryUrl(url) {
  const regex = /upload(?:\/v\d+)?\/([^.]+)/;
  const matches = url.match(regex);

  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    return "";
  }
}

module.exports = exports;
