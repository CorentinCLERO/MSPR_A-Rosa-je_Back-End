module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    }
  }, {
    tableName: "Messages",
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  });

  Message.associate = function(models) {
    Message.belongsTo(models.User, { as: "Sender", foreignKey: "senderId" });
    Message.belongsTo(models.User, { as: "Receiver", foreignKey: "receiverId" });
  };

  return Message;
};
