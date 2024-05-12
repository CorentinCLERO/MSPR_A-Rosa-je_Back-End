const { User, DenyJWT } = require("../models"); // Assurez-vous que ce chemin est correct
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");

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

exports.loginUser = async (req, res) => {
  try {
    const { idToken } = req.body;

    const payload = await verifyToken(idToken);
    if (!payload) {
      return res.status(401).send("ID Token non valide");
    }

    let user;
    const userInstance = await User.findOne({ where: { email: payload.email } });
    user = userInstance ? userInstance.dataValues : null;
    if (!user) {
      user = await User.create({
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture_profile: payload.picture,
        role: "owner"
      });
    }
    
    const userToken = generateJWT(user);
    res.status(201).send({ message: "Utilisateur connecté avec succès", token: userToken, role: user.role, id: user.id });
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la création de l'utilisateur",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
        details: error.details || "Aucun détail supplémentaire"
      } : undefined
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    const tokenInDenyList = await DenyJWT.findOne({ where: { token } });
    if (tokenInDenyList) {
      return res.status(401).send({
        message: "Le token est invalidé et ne peut plus être utilisé"
      });
    }

    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Échec de la vérification du token",
          error: err.message
        });
      }

      res.status(200).send({
        message: "Token vérifié avec succès",
        ...decoded
      });
    });

  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la vérification du token",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
        details: error.details || "Aucun détail supplémentaire"
      } : undefined
    });
  }
};

exports.getAdminBearerToken = async (req, res) => {
  try {
    const user = {
      email: "admin@msprarosaje.com",
      firstName: "admin",
      lastName: "admin",
      picture_profile: "",
      role: "admin"
    };
  
    const userToken = generateJWT(user);
    res.status(201).send({ message: "Utilisateur connecté avec succès", token: userToken, role: user.role, id: user.id });
  } catch (error) {
    res.status(500).send({
      message: "Génération de token échoué",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
        details: error.details || "Aucun détail supplémentaire"
      } : undefined
    });
  }
};

async function verifyToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

function generateJWT(user) {
  const token = jwt.sign({
    userId: user.id,
    email: user.email,
    role: user.role
  }, process.env.SECRET_JWT, { expiresIn: "24h" });

  return token;
}