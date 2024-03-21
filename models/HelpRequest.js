module.exports = (sequelize, DataTypes) => {
  const HelpRequest = sequelize.define("HelpRequest", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    treated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    answer: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    plant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  HelpRequest.associate = function (models) {
    HelpRequest.hasMany(models.Picture, { foreignKey: "helpRequest_id" });
    HelpRequest.hasOne(models.Plant, { foreignKey: "id" });
  };

  return HelpRequest;
};
