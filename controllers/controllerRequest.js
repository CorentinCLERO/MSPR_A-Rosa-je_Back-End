const { Request, Adress } = require("../models"); 
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
    const requests = await Request.findAll({
      where: {
        status: "mission",
      },
    });
    const requestList = await Promise.all(requests.map(async (request) => {
      const adress = await Adress.findOne({
        where: { id: request.adress_id },
      });
      const compactAdress = adress ? `${adress.number} ${adress.street} ${adress.city} ${adress.country}` : "adresse inconnue";
      const convertedAdress = adress ? await geocodeAddress(compactAdress) : { latitude: null, longitude: null };

      return {
        ...request.dataValues,
        adress: compactAdress,
        latitude: convertedAdress.latitude,
        longitude: convertedAdress.longitude,
        createdAt: undefined,
        updatedAt: undefined,
        userId: undefined,
      };
    }));

    res.json(requestList);
  } catch (error) {
    console.error("Erreur lors de la récupération des requêtes:", error);
    res.status(500).send({
      message: "Une erreur s'est produite lors de la récupération des requêtes.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};
