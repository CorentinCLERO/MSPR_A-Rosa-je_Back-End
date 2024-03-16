module.exports = (sequelize, DataTypes) => {
  const Plant = sequelize.define("Plant", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    movable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Plant.associate = function(models) {
    Plant.hasMany(models.Picture, {
      foreignKey: "plant_id",
      as: "pictures",
    });
    Plant.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Plant;
};
