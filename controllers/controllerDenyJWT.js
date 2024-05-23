const { DenyJWT } = require("../models");

exports.addDenyjwt = async (req, res) => {
  try {
    const { token } = req.body;

    await DenyJWT.create({ token: token });

    res.status(201).send("token Ajouté à la liste Deny");
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la création de l'utilisateur",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};