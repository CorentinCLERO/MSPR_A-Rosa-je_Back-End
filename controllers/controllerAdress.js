const { User, Adress } = require("../models");
const axios = require("axios");

exports.getAdresses = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }
    const userAdresses = await Adress.findAll({
      where: { user_id: userId },
    });

    const UserAdressesWithLongLat = await Promise.all(
      userAdresses.map(async (userAdress) => {
        const compactAdress = userAdress
          ? `${userAdress.number} ${userAdress.street} ${userAdress.city} ${userAdress.country}`
          : "adresse inconnue";
          
        const convertedAdress = userAdress
          ? await geocodeAddress(compactAdress)
          : { latitude: null, longitude: null };

        return {
          ...userAdress.dataValues,
          latitude: convertedAdress.latitude,
          longitude: convertedAdress.longitude,
        };
      }));

    res.status(200).json(UserAdressesWithLongLat);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des demandes d'aide :",
      error
    );
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
