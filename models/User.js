module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    botaniste_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pseudo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    firstLogin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    wantToBeKeeper: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    validatePrivacyPolicy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    picture_profile: DataTypes.STRING
  });

  User.associate = function(models) {
    User.hasMany(models.Request, { foreignKey: "user_id" });
    User.hasMany(models.Adress, { foreignKey: "user_id" });
    User.hasMany(models.HelpRequest, { foreignKey: "user_id" });
    User.hasMany(models.Message, { as: "SentMessages", foreignKey: "senderId" });
    User.hasMany(models.Message, { as: "ReceivedMessages", foreignKey: "receiverId" });
  };

  return User;
};
