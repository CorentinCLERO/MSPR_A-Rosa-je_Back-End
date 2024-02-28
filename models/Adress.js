module.exports = (sequelize, DataTypes) => {
  const Adress = sequelize.define('Adress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: DataTypes.STRING
    },
    street: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    postcode: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    }
  });

  Adress.associate = function(models) {
    Adress.hasMany(models.Request, { foreignKey: 'adress_id' });
    Adress.hasMany(models.Plant, { foreignKey: 'adress_id' });
  };

  return Adress;
};
