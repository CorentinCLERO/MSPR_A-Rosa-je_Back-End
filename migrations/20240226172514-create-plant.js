'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Plant', {
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
          model: 'Adress',
          key: 'id'
        },
        onUpdate: 'CASCADE'
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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Plant');
  }
};
