const { User } = require("../models"); // Assurez-vous que ce chemin est correct

exports.createUser = async (req, res) => {
  try {
    const { email, password, pseudo, role, firstname, lastname } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("L'utilisateur existe déjà");
    }
    
    // Créer un nouvel utilisateur
    await User.create({
      email,
      password,
      pseudo,
      role,
      firstname,
      lastname,
    });

    res.status(201).send("Utilisateur ajouté avec succès");
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
