module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    'Requests',
    [
      {
        requesterId: 1,
        managerId: 2,
        type: 'one_way',
        reason: 'partner engagment',
        origin: 'Kigali',
        destination: 'Lagos',
        status: 'pending',
        departureDate: '2020-04-01',
        returnDate: '2020-06-01',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        requesterId: 4,
        managerId: 2,
        type: 'two_way',
        reason: 'partner engagment',
        origin: 'Kigali',
        destination: 'Kampala',
        status: 'pending',
        departureDate: '2020-05-01',
        returnDate: '2020-07-01',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        requesterId: 3,
        managerId: 2,
        type: 'one_way',
        reason: 'partner engagment',
        origin: 'Kigali',
        destination: 'Lagos',
        status: 'approved',
        departureDate: '2020-02-01',
        returnDate: '2020-06-01',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        requesterId: 7,
        managerId: 6,
        type: 'one_way',
        reason: 'market research',
        origin: 'Kigali',
        destination: 'Lagos',
        status: 'pending',
        departureDate: '2020-02-01',
        returnDate: '2020-06-01',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),

  down: (queryInterface) => queryInterface.bulkDelete('Requests', null, {})
};
