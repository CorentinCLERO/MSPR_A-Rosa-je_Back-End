module.exports = (sequelize, DataTypes) => {
  const Picture = sequelize.define("Picture", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT
    }
  });
  return Picture;
};
