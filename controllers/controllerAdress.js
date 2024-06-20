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

exports.addAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { number, street, city, country, cp } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    const existingAddress = await Adress.findOne({
      where: {
        user_id: userId,
        number,
        street,
        city,
        country,
        cp,
      },
    });

    if (existingAddress) {
      return res.status(409).send("Cette adresse existe déjà.");
    }

    const newAddress = await Adress.create({
      user_id: userId,
      number,
      street,
      city,
      country,
      cp,
    });

    const compactAddress = `${newAddress.number} ${newAddress.street} ${newAddress.city} ${newAddress.country}`;
    const convertedAddress = await geocodeAddress(compactAddress);

    newAddress.latitude = convertedAddress.latitude;
    newAddress.longitude = convertedAddress.longitude;
    await newAddress.save();

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).send({
      message: "Une erreur s'est produite lors de l'ajout de l'adresse.",
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

exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;

    const address = await Adress.findByPk(addressId);
    if (!address) {
      return res.status(404).send("Adresse non trouvée.");
    }

    await address.destroy();

    res.status(200).send("Adresse supprimée avec succès.");
  } catch (error) {
    res.status(500).send({
      message: "Une erreur s'est produite lors de la suppression de l'adresse.",
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
    console.log("adresse", address);
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
