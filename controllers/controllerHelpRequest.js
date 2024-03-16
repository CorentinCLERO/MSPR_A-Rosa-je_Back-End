const { User, HelpRequest } = require("../models");

exports.getHelpRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    const helpRequests = await HelpRequest.findAll({
      where: { userId: user.id }
    });

    console.log(user);
    res.json(helpRequests);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes d'aide :", error);
    res.status(500).send({
      message: "Une erreur s'est produite lors de la récupération des demandes d'aide.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};
