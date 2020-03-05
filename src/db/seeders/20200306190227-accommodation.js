
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Accommodation', [{

    locationName: 'New york city',
    streetNumber: '104st',
    numberOfRooms: 1,
    imageOfBuilding: 'localhost/image',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),


  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Accommodation', null, {})
};
