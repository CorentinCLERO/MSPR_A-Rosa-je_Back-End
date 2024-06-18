const { Op } = require("sequelize");
const { User, Message } = require("../models");


// Exemple de création d'un nouveau message
exports.createMessage = async (req, res) => {
  try {
    const { content, senderId, receiverId } = req.body;
    const newMessage = await Message.create({ content, senderId, receiverId });
    const io = req.app.get("io");
    io.to(receiverId).emit("new_message", newMessage.dataValues);
    res.status(201).send(newMessage.dataValues);
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la création du message",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
        details: error.details || "Aucun détail supplémentaire"
      } : undefined
    });
  }
};

exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      },
      include: [
        { model: User, as: "Sender", attributes: ["id", "pseudo"] },
        { model: User, as: "Receiver", attributes: ["id", "pseudo"] }
      ],
      order: [["timestamp", "ASC"]]
    });
    const formattedMessages = messages?.map(message => ({
      id: message?.id,
      content: message?.content,
      pseudo: message?.Sender?.pseudo,
      timestamp: message?.timestamp
    }));

    res.status(200).send(formattedMessages);
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la récupération des messages",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
        details: error.details || "Aucun détail supplémentaire"
      } : undefined
    });
  }
};

exports.getAllMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        { model: User, as: "Sender", attributes: ["id", "pseudo"] },
        { model: User, as: "Receiver", attributes: ["id", "pseudo"] }
      ]
    });

    const users = {};
    messages.forEach(message => {
      if (message.senderId !== parseInt(userId, 10)) {
        users[message.senderId] = message.Sender.pseudo;
      }
      if (message.receiverId !== parseInt(userId, 10)) {
        users[message.receiverId] = message.Receiver.pseudo;
      }
    });

    const result = Object.keys(users).map(key => ({
      id: parseInt(key, 10),
      pseudo: users[key]
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la récupération des utilisateurs avec lesquels des messages ont été échangés.",
      error: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }
};