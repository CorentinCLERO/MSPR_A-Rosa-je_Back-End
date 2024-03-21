"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("HelpRequests", "plant_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Plants",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("HelpRequests", "plant_id");
  },
};
