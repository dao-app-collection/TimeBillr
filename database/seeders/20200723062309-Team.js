'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
    */
    //  Example:
     await queryInterface.bulkInsert('Teams', [{
       name: "Domino's Pizza Morayfield",
       description: 'We make and deliver Pizzas'
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
