module.exports = (sequelize, DataTypes) => {
  const PlantRequest = sequelize.define("PlantRequest", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Request.associate = function (models) {
    Request.belongsTo(models.Plant, {
      foreignKey: "plant_id",
      sourceKey: "id",
    });
    Request.belongsTo(models.Request, {
      foreignKey: "request_id",
      sourceKey: "id",
    });
  };

  return PlantRequest;
};
