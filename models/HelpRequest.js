module.exports = (sequelize, DataTypes) => {
  const HelpRequest = sequelize.define("HelpRequest", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    treated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    answer: {
      type: DataTypes.TEXT
    }
  });

  HelpRequest.associate = function(models) {
    HelpRequest.hasMany(models.Picture, { foreignKey: "helpRequest_id" });
  };

  return HelpRequest;
};
