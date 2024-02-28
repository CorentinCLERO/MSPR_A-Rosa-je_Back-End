module.exports = (sequelize, DataTypes) => {
  const Plant = sequelize.define('Plant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: false
    },
    movable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Plant.associate = function(models) {
    Plant.hasMany(models.Picture, { foreignKey: 'plant_id' });
  };

  return Plant;
};
