module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define("Request", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    begin_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    adress_id: {
      type: DataTypes.INTEGER,
    },
  });

  Request.associate = function (models) {
    Request.hasMany(models.Plant, { foreignKey: "request_id" });
    Request.hasMany(models.Picture, { foreignKey: "request_id" });
    Request.belongsTo(models.Adress, { foreignKey: "adress_id" });
  };

  return Request;
};
