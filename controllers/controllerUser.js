const { User, DenyJWT } = require("../models");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_ENV);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      message: "Une erreur s'est produite lors de la récupération des utilisateurs.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, pseudo, role, firstname, lastname } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("L'utilisateur existe déjà");
    }

    const lowerCaseEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({
      email: lowerCaseEmail,
      password: hashedPassword,
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
    const { idToken, email, password } = req.body;

    if (idToken) {
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
      return res.status(201).send({
        message: "Utilisateur connecté avec succès",
        token: userToken,
        role: user.role,
        id: user.id,
        user: userInstance.dataValues
      });
    } else if (email && password) {
      const lowerCaseEmail = email.toLowerCase();
      let userInstance = await User.findOne({ where: { email: lowerCaseEmail } });

      if (!userInstance) {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        userInstance = await User.create({
          email: lowerCaseEmail,
          password: hashedPassword,
          role: "owner",
          pseudo: "",
        });
      } else {
        const validPassword = await bcrypt.compare(password, userInstance.password);
        if (!validPassword) {
          return res.status(401).send("Mot de passe incorrect");
        }
      }

      const user = userInstance.dataValues;
      const userToken = generateJWT(user);
      return res.status(201).send({
        message: "Utilisateur connecté avec succès",
        token: userToken,
        role: user.role,
        id: user.id,
        user
      });
    } else {
      return res.status(400).send("Requête invalide : fournissez soit un idToken, soit un email et un mot de passe");
    }
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la connexion de l'utilisateur",
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
    jwt.verify(token, process.env.SECRET_JWT, async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Échec de la vérification du token",
          error: err.message
        });
      }
      
      const user = await User.findOne({ where: { email: decoded.email } });
      res.status(200).send({
        message: "Token vérifié avec succès",
        ...decoded,
        user: user?.dataValues
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

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send("Email ou mot de passe incorrect");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Email ou mot de passe incorrect");
    }

    if (user.role !== "admin") {
      return res.status(401).send("Vous n'êtes pas autorisé à accéder à cette ressource");
    }

    const userToken = generateJWT(user);
    res.status(201).send({ message: "Utilisateur connecté avec succès", token: userToken, role: user.role, id: user.id, user: user?.dataValues });
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la connexion de l'utilisateur",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
        details: error.details || "Aucun détail supplémentaire"
      } : undefined
    });
  }
};

exports.verifyAdminToken = async (req, res) => {
  try {
    const { token } = req.body;

    const tokenInDenyList = await DenyJWT.findOne({ where: { token } });
    if (tokenInDenyList) {
      return res.status(401).send({
        message: "Le token est invalidé et ne peut plus être utilisé"
      });
    }

    jwt.verify(token, process.env.SECRET_JWT, async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Échec de la vérification du token",
          error: err.message
        });
      }

      const user = await User.findOne({ where: { email: decoded.email } });
      if (!user || user.role !== "admin") {
        return res.status(401).send("Vous n'êtes pas autorisé à accéder à cette ressource");
      }

      res.status(200).send({
        message: "Token vérifié avec succès",
        ...decoded,
        user: user?.dataValues
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

exports.modifyUser = async (req, res) => {
  const userId = req.params.id;
  const {
    email,
    botaniste_id,
    password,
    pseudo,
    role,
    firstname,
    lastname,
    firstLogin,
    wantToBeKeeper,
    picture_profile,
    validatePrivacyPolicy,
  } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (email !== undefined) user.email = email;
    if (botaniste_id !== undefined) user.botaniste_id = botaniste_id;
    if (password !== undefined) user.password = password;
    if (pseudo !== undefined) user.pseudo = pseudo;
    if (role !== undefined) user.role = role;
    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (firstLogin !== undefined) user.firstLogin = firstLogin;
    if (wantToBeKeeper !== undefined) user.wantToBeKeeper = wantToBeKeeper;
    if (picture_profile !== undefined) user.picture_profile = picture_profile;
    if (validatePrivacyPolicy !== undefined) user.validatePrivacyPolicy = validatePrivacyPolicy;
    
    await user.save();
    
    res.status(200).json({user: user?.dataValues});
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the user." });
  }
};

async function verifyToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID_ENV,
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