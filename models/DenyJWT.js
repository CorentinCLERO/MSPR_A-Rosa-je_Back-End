module.exports = (sequelize, DataTypes) => {
  const DenyJWT = sequelize.define("DenyJWT", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return DenyJWT;
};
