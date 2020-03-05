'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Accommodation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      locationName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      streetNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      numberOfRooms: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      availableRooms: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: true
      },
      imageOfBuilding: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Accommodation');
  }
};