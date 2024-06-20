const {
  Request,
  Adress,
  Picture,
  PlantRequests,
  User,
  Plant,
} = require("../models");
const axios = require("axios");

async function geocodeAddress(address) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: "AIzaSyCKgUcDZ35zY5ymmTSnYyWVH61bOkWnyyw",
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

exports.getRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).send({
        message: "Aucun utilisateur trouvé pour cet identifiant.",
      });
    }

    const requests = await Request.findAll({
      where: { user_id: userId },
      order: [["updatedAt", "DESC"]],
    });
    const requestList = await Promise.all(
      requests.map(async (request) => {
        const adress = await Adress.findOne({
          where: { id: request.adress_id },
        });
        const compactAdress = adress
          ? `${adress.number} ${adress.street} ${adress.city} ${adress.country}`
          : "adresse inconnue";
        const convertedAdress = adress
          ? await geocodeAddress(compactAdress)
          : { latitude: null, longitude: null };

        const plantRequests = await PlantRequests.findAll({
          where: { request_id: request.dataValues.id },
        });
        
        const plants = await Promise.all(plantRequests.map(async plantRequest => {
          const plant = await Plant.findOne({ where: { id: plantRequest.dataValues.plant_id }});
          return {...plant.dataValues};
        }));

        const plantsWithPictures = await Promise.all(plants.map(async plant => {
          const pic = await Picture.findOne({ where: {plant_id: plant.id}});
          return {...plant, picture: pic.dataValues};
        }));

        return {
          ...request.dataValues,
          adress: {
            ...adress.dataValues,
            full_adress: compactAdress,
            latitude: convertedAdress.latitude,
            longitude: convertedAdress.longitude,
          },
          plants: plantsWithPictures,
          createdAt: undefined,
          updatedAt: undefined,
          userId: undefined,
        };
      })
    );

    res.json(requestList);
  } catch (error) {
    res.status(500).send({
      message:
        "Une erreur s'est produite lors de la récupération des requêtes.",
      error:
        process.env.NODE_ENV === "development"
          ? {
            message: error.message,
            stack: error.stack,
          }
          : undefined,
    });
  }
};

exports.RequestAccept = async (req, res) => {
  try {
    const userId = req.body.userId;
    const requestId = req.params.requestId;

    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).send({
        message: "Aucun utilisateur trouvé pour cet identifiant.",
      });
    }
    if (user.dataValues.role !== "gardien") {
      return res.status(404).send({
        message: "Vous devez être un gardien pour accepter une demande.",
      });
    }
    if (user.dataValues.role === "gardien") {
      const requests = await Request.findOne({
        where: { id: requestId },
      });
      if (!requests) {
        return res.status(404).send({
          message: "Aucune demande trouvée pour cet identifiant.",
        });
      }
      await Request.update(
        {
          guard_id: userId,
          status: "missions",
        },
        {
          where: { id: requestId },
        }
      );
      res.json("l’acceptation a bien été prise en compte");
    }
  } catch (error) {
    res.status(500).send({
      message: "Une erreur s'est produite lors de l'acceptation de la requête.",
      error:
        process.env.NODE_ENV === "development"
          ? {
            message: error.message,
            stack: error.stack,
          }
          : undefined,
    });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      order: [["updatedAt", "DESC"]],
    });
    const requestList = await Promise.all(
      requests.map(async (request) => {
        const adress = await Adress.findOne({
          where: { id: request.adress_id },
        });
        const compactAdress = adress
          ? `${adress.number} ${adress.street} ${adress.city} ${adress.country}`
          : "adresse inconnue";
        const convertedAdress = adress
          ? await geocodeAddress(compactAdress)
          : { latitude: null, longitude: null };

        const plantRequests = await PlantRequests.findAll({
          where: { request_id: request.dataValues.id },
        });
        
        const plants = await Promise.all(plantRequests.map(async plantRequest => {
          const plant = await Plant.findOne({ where: { id: plantRequest.dataValues.plant_id }});
          return {...plant.dataValues};
        }));

        const plantsWithPictures = await Promise.all(plants.map(async plant => {
          const pic = await Picture.findOne({ where: {plant_id: plant.id}});
          return {...plant, picture: pic.dataValues};
        }));

        return {
          ...request.dataValues,
          adress: {
            ...adress.dataValues,
            full_adress: compactAdress,
            latitude: convertedAdress.latitude,
            longitude: convertedAdress.longitude,
          },
          plants: plantsWithPictures,
          createdAt: undefined,
          updatedAt: undefined,
          userId: undefined,
        };
      })
    );

    res.json(requestList);
  } catch (error) {
    res.status(500).send({
      message: "Une erreur s'est produite lors de la récupération des requêtes.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;

    const request = await Request.findOne({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).send({
        message: "Aucune requête trouvée pour cet identifiant.",
      });
    }

    request.status = status;
    await request.save();

    res.send({
      message: "La requête a été mis à jour avec succès.",
      request: request,
    });
  } catch (error) {
    res.status(500).send({
      message:
        "Une erreur s'est produite lors de la mise à jour de la requête.",
      error:
        process.env.NODE_ENV === "development"
          ? {
            message: error.message,
            stack: error.stack,
          }
          : undefined,
    });
  }
};

exports.postRequest = async (req, res) => {
  try {
    const { userId, begin_date, end_date, plants, reason, description, adress } =
      req.body;

    const request = await Request.create({
      user_id: userId,
      begin_date: begin_date,
      end_date: end_date,
      reason: reason,
      status: "slot",
      description: description,
      adress_id: adress.id,
    });

    for (let i = 0; i < plants.length; i++) {
      await PlantRequests.create({
        plant_id: plants[i].id,
        request_id: request.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.json({ message: "requête créée avec succès.", requestId: request.id });
  } catch (error) {
    res.status(500).send({
      message:
        "Une erreur s'est produite lors de la récupération des demandes d'aide.",
      error:
        process.env.NODE_ENV === "development"
          ? {
            message: error.message,
            stack: error.stack,
          }
          : undefined,
    });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = await Request.findOne({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).send({
        message: "Aucune requête trouvée pour cet identifiant.",
      });
    } else {
      await Request.destroy({
        where: { id: requestId },
      });

      res.json("requête supprimée avec succès.");
    }
  } catch (error) {
    res.status(500).send({
      message:
        "Une erreur s'est produite lors de la suppression de la requête.",
    });
  }
};

exports.getRequest = async (req, res) => {
  try {
    const { userId, request_id } = req.body;
    const request = await Request.findOne({
      where: { id: request_id, user_id: userId },
    });

    if (!request) {
      return res.status(404).send({
        message: "Aucune requête trouvée pour cet identifiant.",
      });
    } else {
      return res.json(request);
    }
  } catch (error) {
    res.status(500).send({
      message:
        "Une erreur s'est produite lors de la récupération de la requête.",
    });
  }
};

exports.post = async (req, res) => {
  try {
    const request_id = req.params.requestId;
    const { picture, message } = req.body;

    await Picture.create({
      url: picture,
      message: message,
      request_id: request_id,
    });

    res.json("post créé avec succès.");
  } catch (error) {
    res.status(500).send({
      message: "Une erreur s'est produite lors de la création du post.",
    });
  }
};
