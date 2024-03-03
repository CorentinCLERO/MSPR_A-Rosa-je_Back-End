("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Plant extends Model {
    static associate(models) {
      this.hasMany(models.Picture, {
        foreignKey: "plant_id",
        as: "pictures",
      });
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Plant.init(
    {
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
    },
    {
      sequelize,
      modelName: "Plant",
      tableName: "Plant",
    }
  );
  return Plant;
};
