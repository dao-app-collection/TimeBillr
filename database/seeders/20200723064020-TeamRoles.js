'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Add seed commands here.
    //     Example:
    await queryInterface.bulkInsert('TeamRoles', [{
      Title: 'In-store',
      TeamId: 1,
      casualRate: 16.50,
      partTimeRate: 14.50,
      fullTimeRate: 14.50,
    },{
      Title: 'Driver',
      TeamId: 1,
      casualRate: 18.50,
      partTimeRate: 16.50,
      fullTimeRate: 16.50,
    }, {
      Title: 'Wobbler',
      TeamId: 1,
      casualRate: 13.50,
      partTimeRate: 11.50,
      fullTimeRate: 11.50,
    }], {});
},

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
