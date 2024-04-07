"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Plants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      variety: {
        type: Sequelize.STRING,
        allowNull: false
      },
      movable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      adress_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Adresses",
          key: "id"
        },
        onUpdate: "CASCADE"
      },
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Requests",
          key: "id"
        },
        onUpdate: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Plants");
  }
};
