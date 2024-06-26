const { User, HelpRequest } = require("../models");

exports.getHelpRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }
    const helpRequests = await HelpRequest.findAll({
      where: { user_id: user.id },
    });

    res.json(helpRequests);
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

exports.getAllHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.findAll();

    res.json(helpRequests);
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

exports.getHelpRequestInfo = async (req, res) => {
  try {
    const plantSosId = req.params.plantSosId;

    const plantSos = await HelpRequest.findByPk(plantSosId);

    res.json(plantSos);
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

exports.postHelpRequest = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    await HelpRequest.create({
      title: title,
      description: description,
      user_id: userId,
      treated: false,
      answer: null,
    });

    res.json("la plantSos a bien été créée");
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

exports.postHelpRequestAnswer = async (req, res) => {
  try {
    const plantSosId = req.params.plantSosId;
    const { answer } = req.body;

    const plantSos = await HelpRequest.findByPk(plantSosId);

    if (!plantSos) {
      return res.status(404).send("plantsOS non trouvée.");
    }

    plantSos.update({
      answer: answer,
      treated: true,
    });

    res.json("le commentaire a bien été envoyé");
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
