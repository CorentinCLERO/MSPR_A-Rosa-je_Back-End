("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Plants extends Model {
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
  Plants.init(
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Plants",
      tableName: "Plants",
    }
  );
  return Plants;
};
