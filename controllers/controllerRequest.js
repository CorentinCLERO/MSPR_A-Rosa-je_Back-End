const e = require("express");
const { Request, Adress, Picture, PlantRequest } = require("../models");
const axios = require("axios");

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

exports.getRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requestStatus = req.query.request_status;

    const whereCondition = requestStatus ? { status: requestStatus } : {};

    const requests = await Request.findAll({
      where: { ...whereCondition, user_id: userId },
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

        const picture = await Picture.findAll({
          where: { request_id: request.dataValues.id },
        });

        return {
          ...request.dataValues,
          adress: {
            ...adress.dataValues,
            full_adress: compactAdress,
            latitude: convertedAdress.latitude,
            longitude: convertedAdress.longitude,
          },
          plants: picture,
          createdAt: undefined,
          updatedAt: undefined,
          userId: undefined,
        };
      })
    );

    res.json(requestList);
  } catch (error) {
    console.error("Erreur lors de la récupération des requêtes:", error);
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

exports.postRequest = async (req, res) => {
  try {
    const { userId, beginDate, endDate, plants, reason, description } =
      req.body;

    const adress = await Adress.findOne({
      where: { user_id: userId },
    });

    if (!adress) {
      return res.status(404).send({
        message: "Aucune adresse trouvée pour cet utilisateur.",
      });
    }

    const request = await Request.create({
      user_id: userId,
      begin_date: beginDate,
      end_date: endDate,
      reason: reason,
      status: "pending",
      description: description,
      adress_id: adress.id,
    });

    for (let i = 0; i < plants.length; i++) {
      const plantrequest = await PlantRequest.create({
        plant_id: plants[i],
        request_id: request.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.json("requête créée avec succès.");
  } catch (error) {
    console.error("Erreur lors de la création de la requête:", error);
    res.status(500).send({
      message: "Une erreur s'est produite lors de la création de la requête.",
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
    console.error("Erreur lors de la récupération de la requête", error);
    res.status(500).send({
      message:
        "Une erreur s'est produite lors de la récupération de la requête.",
    });
  }
};

exports.addRequest = async (req, res) => {
  try {
    const { userId, adress_id, request_id, variety, movable, message } =
      req.body;
  } catch (error) {
    console.error("Erreur lors de la création de requête:", error);
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
