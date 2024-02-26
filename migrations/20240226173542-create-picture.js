'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Picture', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT
      },
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Request',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      plant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Plant',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      helpRequest_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'HelpRequest',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Picture');
  }
};
